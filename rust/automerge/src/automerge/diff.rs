use itertools::Itertools;
use std::ops::Deref;
use std::rc::Rc;

use crate::patches::TextRepresentation;
use crate::{
    marks::{RichText, RichTextStateMachine},
    patches::PatchLog,
    types::{Clock, ListEncoding, ObjMeta, Op, ScalarValue},
    Automerge, ObjType, OpType,
};

#[derive(Clone, Debug)]
struct Winner<'a> {
    op: &'a Op,
    clock: &'a Clock,
    cross_visible: bool,
    conflict: bool,
}

impl<'a> Deref for Winner<'a> {
    type Target = Op;

    fn deref(&self) -> &'a Self::Target {
        self.op
    }
}

fn process<'a, T: Iterator<Item = &'a Op>>(
    ops: T,
    before: &'a Clock,
    after: &'a Clock,
    diff: &mut RichTextDiff<'a>,
) -> Option<Patch<'a>> {
    let mut before_op = None;
    let mut after_op = None;

    for op in ops {
        let predates_before = op.predates(before);
        let predates_after = op.predates(after);

        if predates_before && !op.was_deleted_before(before) {
            push_top(&mut before_op, op, predates_after, before);
        }

        if predates_after && !op.was_deleted_before(after) {
            push_top(&mut after_op, op, predates_before, after);
        }
    }
    resolve(before_op, after_op, diff)
}

fn push_top<'a>(top: &mut Option<Winner<'a>>, op: &'a Op, cross_visible: bool, clock: &'a Clock) {
    match &op.action {
        OpType::Increment(_) => {} // can ignore - info captured inside Counter
        _ => {
            top.replace(Winner {
                op,
                clock,
                cross_visible,
                conflict: top.is_some(),
            });
        }
    }
}

fn resolve<'a>(
    before: Option<Winner<'a>>,
    after: Option<Winner<'a>>,
    diff: &mut RichTextDiff<'a>,
) -> Option<Patch<'a>> {
    diff.process(&before, &after);
    match (before, after) {
        (_, Some(after)) if after.is_mark() => None,
        (Some(before), _) if before.is_mark() => None,
        (None, Some(after)) => Some(Patch::New(after, diff.after.current().cloned())),
        (Some(before), None) => Some(Patch::Delete(before)),
        (Some(before), Some(after)) if before.op.id == after.op.id => Some(Patch::Old {
            before,
            after,
            marks: diff.current(),
        }),
        (Some(before), Some(after)) if before.op.id != after.op.id => Some(Patch::Update {
            before,
            after,
            marks: diff.after.current().cloned(),
        }),
        _ => None,
    }
}

#[derive(Debug, Clone)]
enum Patch<'a> {
    New(Winner<'a>, Option<Rc<RichText>>),
    Old {
        before: Winner<'a>,
        after: Winner<'a>,
        marks: Option<Rc<RichText>>,
    },
    Update {
        before: Winner<'a>,
        after: Winner<'a>,
        marks: Option<Rc<RichText>>,
    },
    Delete(Winner<'a>),
}

impl<'a> Patch<'a> {
    fn op(&'a self) -> &'a Op {
        match self {
            Patch::New(op, _) => op,
            Patch::Update { after, .. } => after,
            Patch::Old { after, .. } => after,
            Patch::Delete(op) => op,
        }
    }
}

pub(crate) fn log_diff(doc: &Automerge, before: &Clock, after: &Clock, patch_log: &mut PatchLog) {
    for (obj, ops) in doc.ops().iter_objs() {
        let mut diff = RichTextDiff::new(doc);
        let ops_by_key = ops.group_by(|o| o.elemid_or_key());
        let diffs = ops_by_key
            .into_iter()
            .filter_map(|(_key, key_ops)| process(key_ops, before, after, &mut diff));

        if obj.typ == ObjType::Text && matches!(patch_log.text_rep(), TextRepresentation::String) {
            log_text_diff(patch_log, &obj, diffs)
        } else if obj.typ.is_sequence() {
            log_list_diff(patch_log, &obj, diffs);
        } else {
            log_map_diff(doc, patch_log, &obj, diffs);
        }
    }
}

fn log_list_diff<'a, I: Iterator<Item = Patch<'a>>>(
    patch_log: &mut PatchLog,
    obj: &ObjMeta,
    patches: I,
) {
    patches.fold(0, |index, patch| match patch {
        Patch::New(op, _) => {
            let value = op.value_at(Some(op.clock)).into();
            patch_log.insert(obj, index, value, op.id, op.conflict);
            index + 1
        }
        Patch::Update { before, after, .. } => {
            let conflict = !before.conflict && after.conflict;
            if after.cross_visible {
                let value = after.value_at(Some(after.clock)).into();
                patch_log.put_seq(obj, index, value, after.id, conflict, true)
            } else {
                let value = after.value_at(Some(after.clock)).into();
                patch_log.put_seq(obj, index, value, after.id, conflict, false)
            }
            index + 1
        }
        Patch::Old {
            before,
            after,
            marks,
        } => {
            if !before.conflict && after.conflict {
                patch_log.flag_conflict_seq(obj, index);
            }
            if let Some(n) = get_inc(&before, &after) {
                patch_log.increment_seq(obj, index, n, after.id);
            }
            if let Some(marks) = &marks {
                patch_log.mark(obj, index, 1, marks)
            }
            index + 1
        }
        Patch::Delete(_) => {
            patch_log.delete_seq(obj, index, 1);
            index
        }
    });
}

fn log_text_diff<'a, I: Iterator<Item = Patch<'a>>>(
    patch_log: &mut PatchLog,
    obj: &ObjMeta,
    patches: I,
) {
    let encoding = ListEncoding::Text;
    patches.fold(0, |index, patch| match &patch {
        Patch::New(op, marks) => {
            if op.is_put() {
                patch_log.splice(obj, index, op.to_str(), marks.clone());
            } else {
                // blocks
                let value = op.value_at(Some(op.clock)).into();
                patch_log.insert(obj, index, value, op.id, op.conflict);
            }
            index + op.width(encoding)
        }
        Patch::Update {
            before,
            after,
            marks,
        } => {
            patch_log.delete_seq(obj, index, before.width(encoding));
            patch_log.splice(obj, index, after.to_str(), marks.clone());
            index + after.width(encoding)
        }
        Patch::Old { after, marks, .. } => {
            let len = after.width(encoding);
            if let Some(marks) = marks {
                patch_log.mark(obj, index, len, marks)
            }
            index + len
        }
        Patch::Delete(before) => {
            patch_log.delete_seq(obj, index, before.width(encoding));
            index
        }
    });
}

fn log_map_diff<'a, I: Iterator<Item = Patch<'a>>>(
    doc: &Automerge,
    patch_log: &mut PatchLog,
    obj: &ObjMeta,
    diffs: I,
) {
    diffs
        .filter_map(|patch| Some((get_prop(doc, patch.op())?, patch)))
        .for_each(|(key, patch)| match patch {
            Patch::New(op, _) => {
                let value = op.value_at(Some(op.clock)).into();
                patch_log.put_map(obj, key, value, op.id, op.conflict, false)
            }
            Patch::Update { before, after, .. } => {
                let conflict = !before.conflict && after.conflict;
                if after.cross_visible {
                    let value = after.value_at(Some(after.clock)).into();
                    patch_log.put_map(obj, key, value, after.id, conflict, true)
                } else {
                    let value = after.value_at(Some(after.clock)).into();
                    patch_log.put_map(obj, key, value, after.id, conflict, false)
                }
            }
            Patch::Old { before, after, .. } => {
                if !before.conflict && after.conflict {
                    patch_log.flag_conflict_map(obj, key);
                }
                if let Some(n) = get_inc(&before, &after) {
                    patch_log.increment_map(obj, key, n, after.id);
                }
            }
            Patch::Delete(_) => patch_log.delete_map(obj, key),
        });
}

fn get_prop<'a>(doc: &'a Automerge, op: &Op) -> Option<&'a str> {
    Some(doc.ops().m.props.safe_get(op.key.prop_index()?)?)
}

fn get_inc(before: &Winner<'_>, after: &Winner<'_>) -> Option<i64> {
    if let (Some(ScalarValue::Counter(before_c)), Some(ScalarValue::Counter(after_c))) =
        (before.scalar_value(), after.scalar_value())
    {
        let n = after_c.value_at(after.clock) - before_c.value_at(before.clock);
        if n != 0 {
            return Some(n);
        }
    }
    None
}

#[derive(Debug, Clone)]
struct RichTextDiff<'a> {
    doc: &'a Automerge,
    before: RichTextStateMachine<'a>,
    after: RichTextStateMachine<'a>,
}

impl<'a> RichTextDiff<'a> {
    fn new(doc: &'a Automerge) -> Self {
        RichTextDiff {
            doc,
            before: RichTextStateMachine::default(),
            after: RichTextStateMachine::default(),
        }
    }

    fn current(&self) -> Option<Rc<RichText>> {
        // do this without all the cloning - cache the result
        let b = self.before.current().cloned().unwrap_or_default();
        let a = self.after.current().cloned().unwrap_or_default();
        if a != b {
            let result = b.diff(&a);
            Some(Rc::new(result))
        } else {
            None
        }
    }

    fn process(&mut self, before: &Option<Winner<'a>>, after: &Option<Winner<'a>>) {
        if let Some(w) = &before {
            self.before.process(w.op, &self.doc.ops.m);
        }
        if let Some(w) = &after {
            self.after.process(w.op, &self.doc.ops.m);
        }
    }
}

#[cfg(test)]
mod tests {

    use crate::{
        marks::Mark, transaction::Transactable, types::MarkData, AutoCommit, ObjType, Patch,
        PatchAction, Prop, ScalarValue, Value, ROOT,
    };
    use itertools::Itertools;

    #[derive(Debug, Clone, PartialEq)]
    struct ObservedPatch {
        action: ObservedAction,
        path: String,
    }

    #[derive(Debug, Clone, PartialEq)]
    enum ObservedAction {
        PutMap {
            value: Value<'static>,
            conflict: bool,
        },
        PutSeq {
            value: Value<'static>,
            conflict: bool,
        },
        Insert {
            values: Vec<Value<'static>>,
        },
        DelMap,
        DelSeq,
        Increment(i64),
        SpliceText(String),
        Mark(Vec<ObservedMark>),
        Conflict(Prop),
    }

    #[derive(Debug, Clone, PartialEq)]
    struct ObservedMark {
        start: usize,
        end: usize,
        name: String,
        value: ScalarValue,
    }

    fn ex_path_and<I: Iterator<Item = Prop>, V: Into<Prop>>(props: I, val: V) -> String {
        format!("/{}", props.chain(Some(val.into())).join("/"))
    }

    impl From<&Patch> for ObservedPatch {
        fn from(patch: &Patch) -> Self {
            let path = patch.path.iter().map(|(_, prop)| prop).cloned();
            match patch.action.clone() {
                PatchAction::PutMap {
                    key,
                    value,
                    conflict,
                    ..
                } => ObservedPatch {
                    action: ObservedAction::PutMap {
                        value: value.0,
                        conflict,
                    },
                    path: ex_path_and(path, key),
                },
                PatchAction::PutSeq {
                    index,
                    value,
                    conflict,
                    ..
                } => ObservedPatch {
                    action: ObservedAction::PutSeq {
                        value: value.0,
                        conflict,
                    },
                    path: ex_path_and(path, index),
                },
                PatchAction::DeleteMap { key } => ObservedPatch {
                    action: ObservedAction::DelMap,
                    path: ex_path_and(path, key),
                },
                PatchAction::DeleteSeq { index, .. } => ObservedPatch {
                    action: ObservedAction::DelSeq,
                    path: ex_path_and(path, index),
                },
                PatchAction::Increment { prop, value } => ObservedPatch {
                    action: ObservedAction::Increment(value),
                    path: ex_path_and(path, prop),
                },
                PatchAction::Insert { index, values, .. } => ObservedPatch {
                    action: ObservedAction::Insert {
                        values: values.into_iter().map(|(v, _, _)| v.clone()).collect(),
                    },
                    path: ex_path_and(path, index),
                },
                PatchAction::SpliceText { index, value, .. } => ObservedPatch {
                    action: ObservedAction::SpliceText(value.make_string()),
                    path: ex_path_and(path, index),
                },
                PatchAction::Mark { marks } => ObservedPatch {
                    action: ObservedAction::Mark(
                        marks
                            .into_iter()
                            .map(|Mark { start, end, data }| {
                                let MarkData { name, value } = data.as_ref();
                                ObservedMark {
                                    start,
                                    end,
                                    name: name.to_string(),
                                    value: value.clone(),
                                }
                            })
                            .collect(),
                    ),
                    path: format!("/{}", path.clone().join("/")),
                },
                PatchAction::Conflict { prop } => ObservedPatch {
                    action: ObservedAction::Conflict(prop),
                    path: format!("/{}", path.clone().join("/")),
                },
                PatchAction::SplitBlock { .. } => todo!(),
                PatchAction::JoinBlock { .. } => todo!(),
                PatchAction::UpdateBlock { .. } => todo!(),
            }
        }
    }

    fn exp(patches: Vec<Patch>) -> Vec<ObservedPatch> {
        patches.iter().map(|p| p.into()).collect()
    }

    #[test]
    fn basic_diff_map_put1() {
        let mut doc = AutoCommit::default();
        doc.put(ROOT, "key", "value1").unwrap();
        let heads1 = doc.get_heads();
        doc.put(ROOT, "key", "value2a").unwrap();
        doc.put(ROOT, "key", "value2b").unwrap();
        doc.put(ROOT, "key", "value2c").unwrap();
        let heads2 = doc.get_heads();
        doc.put(ROOT, "key", "value3").unwrap();
        let patches = doc.diff(&heads1, &heads2);

        assert_eq!(
            exp(patches),
            vec![ObservedPatch {
                path: "/key".into(),
                action: ObservedAction::PutMap {
                    value: "value2c".into(),
                    conflict: false,
                },
            }]
        );
    }

    #[test]
    fn basic_diff_map_put_conflict() {
        let mut doc1 = AutoCommit::default();
        doc1.put(ROOT, "key", "value1").unwrap();
        let heads1 = doc1.get_heads();

        let mut doc2 = doc1.fork();

        doc2.put(ROOT, "key", "v2_value2a").unwrap();
        doc2.put(ROOT, "key", "v2_value2b").unwrap();
        doc2.put(ROOT, "key", "v2_value2c").unwrap();

        doc1.put(ROOT, "key", "v1_value2a").unwrap();

        doc1.merge(&mut doc2).unwrap();

        let heads2 = doc1.get_heads();
        doc1.put(ROOT, "key", "value3").unwrap();
        let patches = doc1.diff(&heads1, &heads2);

        assert_eq!(
            exp(patches),
            vec![ObservedPatch {
                path: "/key".into(),
                action: ObservedAction::PutMap {
                    value: "v2_value2c".into(),
                    conflict: true,
                },
            }]
        );
    }

    #[test]
    fn basic_diff_map_put_conflict_with_del() {
        let mut doc1 = AutoCommit::default();
        doc1.put(ROOT, "key1", "value1").unwrap();
        doc1.put(ROOT, "key2", "value2").unwrap();
        let heads1 = doc1.get_heads();

        let mut doc2 = doc1.fork();

        doc2.put(ROOT, "key1", "doc2_value2").unwrap();
        doc2.delete(ROOT, "key2").unwrap();

        doc1.delete(ROOT, "key1").unwrap();
        doc1.put(ROOT, "key2", "doc1_value2").unwrap();

        doc1.merge(&mut doc2).unwrap();

        let heads2 = doc1.get_heads();
        doc1.put(ROOT, "key", "value3").unwrap();
        let patches = doc1.diff(&heads1, &heads2);

        assert_eq!(
            exp(patches),
            vec![
                ObservedPatch {
                    path: "/key1".into(),
                    action: ObservedAction::PutMap {
                        value: "doc2_value2".into(),
                        conflict: false,
                    },
                },
                ObservedPatch {
                    path: "/key2".into(),
                    action: ObservedAction::PutMap {
                        value: "doc1_value2".into(),
                        conflict: false,
                    },
                },
            ]
        );
    }

    #[test]
    fn basic_diff_map_put_conflict_old_value() {
        let mut doc1 = AutoCommit::default();
        doc1.put(ROOT, "key", "value1").unwrap();

        let mut doc2 = doc1.fork();

        doc1.put(ROOT, "key", "v1_value2a").unwrap();

        let heads1 = doc1.get_heads();

        doc2.put(ROOT, "key", "v2_value2a").unwrap();
        doc2.put(ROOT, "key", "v2_value2b").unwrap();
        doc2.put(ROOT, "key", "v2_value2c").unwrap();

        doc1.merge(&mut doc2).unwrap();

        let heads2 = doc1.get_heads();
        doc1.put(ROOT, "key", "value3").unwrap();
        let patches = doc1.diff(&heads1, &heads2);

        assert_eq!(
            exp(patches),
            vec![ObservedPatch {
                path: "/key".into(),
                action: ObservedAction::PutMap {
                    value: "v2_value2c".into(),
                    conflict: true,
                },
            }]
        );
    }

    #[test]
    fn basic_diff_map_put_conflict_old_value_and_del() {
        let mut doc1 = AutoCommit::default();
        doc1.put(ROOT, "key", "value1").unwrap();

        let mut doc2 = doc1.fork();

        doc1.put(ROOT, "key", "v1_value2a").unwrap();

        let heads1 = doc1.get_heads();

        doc2.put(ROOT, "key", "v2_value2a").unwrap();
        doc2.put(ROOT, "key", "v2_value2b").unwrap();
        doc2.put(ROOT, "key", "v2_value2c").unwrap();
        doc2.delete(ROOT, "key").unwrap();

        doc1.merge(&mut doc2).unwrap();

        let heads2 = doc1.get_heads();
        doc1.put(ROOT, "key", "value3").unwrap();
        let patches = doc1.diff(&heads1, &heads2);

        assert_eq!(exp(patches), vec![],);
    }

    #[test]
    fn basic_diff_map_del1() {
        let mut doc = AutoCommit::default();
        doc.put(ROOT, "key", "value1").unwrap();
        let heads1 = doc.get_heads();
        doc.delete(ROOT, "key").unwrap();
        let heads2 = doc.get_heads();
        doc.put(ROOT, "key", "value3").unwrap();
        let patches = doc.diff(&heads1, &heads2);

        assert_eq!(
            exp(patches),
            vec![ObservedPatch {
                path: "/key".into(),
                action: ObservedAction::DelMap,
            }]
        );
    }

    #[test]
    fn basic_diff_map_del2() {
        let mut doc = AutoCommit::default();
        doc.put(ROOT, "key", "value1").unwrap();
        let heads1 = doc.get_heads();
        doc.put(ROOT, "key", "value2a").unwrap();
        doc.put(ROOT, "key", "value2b").unwrap();
        doc.delete(ROOT, "key").unwrap();
        let heads2 = doc.get_heads();
        doc.put(ROOT, "key", "value3").unwrap();
        let patches = doc.diff(&heads1, &heads2);

        assert_eq!(
            exp(patches),
            vec![ObservedPatch {
                path: "/key".into(),
                action: ObservedAction::DelMap,
            }]
        );
    }

    #[test]
    fn basic_diff_map_del3() {
        let mut doc = AutoCommit::default();
        doc.put(ROOT, "key", "value1").unwrap();
        let heads1 = doc.get_heads();
        doc.put(ROOT, "key", "value2a").unwrap();
        doc.put(ROOT, "key", "value2b").unwrap();
        doc.delete(ROOT, "key").unwrap();
        doc.put(ROOT, "key", "value2c").unwrap();
        let heads2 = doc.get_heads();
        doc.put(ROOT, "key", "value3").unwrap();
        let patches = doc.diff(&heads1, &heads2);

        assert_eq!(
            exp(patches),
            vec![ObservedPatch {
                path: "/key".into(),
                action: ObservedAction::PutMap {
                    value: "value2c".into(),
                    conflict: false,
                },
            }]
        );
    }

    #[test]
    fn basic_diff_map_counter1() {
        let mut doc = AutoCommit::default();
        doc.put(ROOT, "key", ScalarValue::counter(10)).unwrap();
        let heads1 = doc.get_heads();
        doc.increment(ROOT, "key", 3).unwrap();
        doc.increment(ROOT, "key", 4).unwrap();
        doc.increment(ROOT, "key", 5).unwrap();
        let heads2 = doc.get_heads();
        doc.put(ROOT, "key", "overwrite").unwrap();
        let patches = doc.diff(&heads1, &heads2);

        assert_eq!(
            exp(patches),
            vec![ObservedPatch {
                path: "/key".into(),
                action: ObservedAction::Increment(12),
            }]
        );
    }

    #[test]
    fn basic_diff_map_counter2() {
        let mut doc = AutoCommit::default();
        let heads1 = doc.get_heads();
        doc.put(ROOT, "key", ScalarValue::counter(10)).unwrap();
        doc.increment(ROOT, "key", 3).unwrap();
        doc.increment(ROOT, "key", 4).unwrap();
        let heads2 = doc.get_heads();
        doc.increment(ROOT, "key", 5).unwrap();
        doc.put(ROOT, "key", "overwrite").unwrap();
        let patches = doc.diff(&heads1, &heads2);

        assert_eq!(
            exp(patches),
            vec![ObservedPatch {
                path: "/key".into(),
                action: ObservedAction::PutMap {
                    value: ScalarValue::counter(17).into(),
                    conflict: false,
                },
            }]
        );
    }

    #[test]
    fn basic_diff_list_insert1() {
        let mut doc = AutoCommit::default();
        let list = doc.put_object(ROOT, "list", ObjType::List).unwrap();
        doc.insert(&list, 0, 10).unwrap();
        doc.insert(&list, 1, 20).unwrap();
        doc.insert(&list, 2, 30).unwrap();
        doc.insert(&list, 3, 40).unwrap();
        let heads1 = doc.get_heads();
        doc.insert(&list, 1, 25).unwrap();
        doc.insert(&list, 3, 35).unwrap();
        doc.delete(&list, 0).unwrap();
        let heads2 = doc.get_heads();
        let patches = doc.diff(&heads1, &heads2);
        assert_eq!(
            exp(patches),
            vec![
                ObservedPatch {
                    path: "/list/0".into(),
                    action: ObservedAction::DelSeq,
                },
                ObservedPatch {
                    path: "/list/0".into(),
                    action: ObservedAction::Insert {
                        values: vec![25.into()],
                    },
                },
                ObservedPatch {
                    path: "/list/2".into(),
                    action: ObservedAction::Insert {
                        values: vec![35.into()],
                    },
                },
            ]
        );
    }

    #[test]
    fn basic_diff_list_insert2() {
        let mut doc = AutoCommit::default();
        let list = doc.put_object(ROOT, "list", ObjType::List).unwrap();
        doc.insert(&list, 0, 10).unwrap();
        doc.insert(&list, 1, 20).unwrap();
        doc.insert(&list, 2, 30).unwrap();
        doc.insert(&list, 3, 40).unwrap();
        let heads1 = doc.get_heads();
        doc.insert(&list, 1, 25).unwrap();
        doc.insert(&list, 1, 26).unwrap();
        doc.insert(&list, 1, 27).unwrap();
        doc.insert(&list, 1, 28).unwrap();
        let heads2 = doc.get_heads();
        let patches = doc.diff(&heads1, &heads2);
        assert_eq!(
            exp(patches),
            vec![ObservedPatch {
                path: "/list/1".into(),
                action: ObservedAction::Insert {
                    values: vec![28.into(), 27.into(), 26.into(), 25.into(),],
                }
            },]
        );
    }

    #[test]
    fn diff_list_concurrent_update() {
        let mut doc1 = AutoCommit::default();
        let list = doc1.put_object(ROOT, "list", ObjType::List).unwrap();

        doc1.insert(&list, 0, 10).unwrap();
        doc1.insert(&list, 1, 20).unwrap();
        doc1.insert(&list, 2, 30).unwrap();
        doc1.insert(&list, 3, 40).unwrap();
        doc1.insert(&list, 4, 50).unwrap();

        let heads1 = doc1.get_heads();

        let mut doc2 = doc1.fork();
        let mut doc3 = doc1.fork();

        doc2.insert(&list, 2, 35).unwrap();
        doc2.put(&list, 2, 36).unwrap();
        doc2.put(&list, 1, 21).unwrap();

        doc3.put(&list, 1, 19).unwrap();

        doc1.merge(&mut doc2).unwrap();
        doc1.merge(&mut doc3).unwrap();

        let heads2 = doc1.get_heads();

        let patches = doc1.diff(&heads1, &heads2);

        assert_eq!(
            exp(patches),
            vec![
                ObservedPatch {
                    path: "/list/1".into(),
                    action: ObservedAction::PutSeq {
                        value: 21.into(),
                        conflict: true,
                    },
                },
                ObservedPatch {
                    path: "/list/2".into(),
                    action: ObservedAction::Insert {
                        values: vec![36.into()],
                    },
                },
            ]
        );
    }

    #[test]
    fn diff_list_interleaved_concurrent_counters() {
        let mut doc1 = AutoCommit::default();
        let list = doc1.put_object(ROOT, "list", ObjType::List).unwrap();

        doc1.insert(&list, 0, 10).unwrap();
        doc1.insert(&list, 1, 20).unwrap();
        doc1.insert(&list, 2, 30).unwrap();
        doc1.insert(&list, 3, 40).unwrap();
        doc1.insert(&list, 4, 50).unwrap();
        doc1.insert(&list, 5, 60).unwrap();

        let heads1 = doc1.get_heads();

        let mut doc2 = doc1.fork();
        let mut doc3 = doc1.fork();

        // doc 2 makes a conflicting counter and incrments it
        doc2.put(&list, 2, ScalarValue::counter(10)).unwrap();
        doc2.increment(&list, 2, 1).unwrap();
        doc2.increment(&list, 2, 1).unwrap();
        doc2.increment(&list, 2, 1).unwrap();

        doc2.put(&list, 3, ScalarValue::counter(100)).unwrap();
        doc2.increment(&list, 3, 10).unwrap();
        doc2.increment(&list, 3, 10).unwrap();
        doc2.increment(&list, 3, 10).unwrap();

        doc2.increment(&list, 2, 1).unwrap();
        doc2.increment(&list, 3, 10).unwrap();

        // doc 3 does the same in the opposite order so we'll have reversed winners

        doc3.put(&list, 3, ScalarValue::counter(101)).unwrap();
        doc3.increment(&list, 3, 11).unwrap();
        doc3.increment(&list, 3, 11).unwrap();
        doc3.increment(&list, 3, 11).unwrap();

        doc3.put(&list, 2, ScalarValue::counter(11)).unwrap();
        doc3.increment(&list, 2, 2).unwrap();
        doc3.increment(&list, 2, 2).unwrap();
        doc3.increment(&list, 2, 2).unwrap();

        doc3.increment(&list, 3, 11).unwrap();
        doc3.increment(&list, 2, 2).unwrap();

        doc3.put(&list, 4, ScalarValue::counter(99)).unwrap();
        doc3.increment(&list, 4, 1).unwrap();
        doc3.increment(&list, 4, 1).unwrap();
        doc3.increment(&list, 4, 1).unwrap();
        doc3.delete(&list, 4).unwrap();

        doc3.insert(&list, 5, ScalarValue::counter(199)).unwrap();
        doc3.increment(&list, 5, 3).unwrap();
        doc3.increment(&list, 5, 3).unwrap();
        doc3.increment(&list, 5, 3).unwrap();
        doc3.delete(&list, 5).unwrap();

        doc1.merge(&mut doc2).unwrap();
        doc1.merge(&mut doc3).unwrap();

        let heads2 = doc1.get_heads();

        doc1.put(&list, 2, 0).unwrap();
        doc1.put(&list, 3, 0).unwrap();

        let patches = doc1.diff(&heads1, &heads2);

        let exp = exp(patches);
        assert_eq!(
            exp.get(0),
            Some(ObservedPatch {
                path: "/list/2".into(),
                action: ObservedAction::PutSeq {
                    value: ScalarValue::counter(19).into(),
                    conflict: true
                },
            })
            .as_ref()
        );
        assert_eq!(
            exp.get(1),
            Some(ObservedPatch {
                path: "/list/3".into(),
                action: ObservedAction::PutSeq {
                    value: ScalarValue::counter(140).into(),
                    conflict: true,
                },
            })
            .as_ref()
        );
        assert_eq!(
            exp.get(2),
            Some(ObservedPatch {
                path: "/list/4".into(),
                action: ObservedAction::DelSeq,
            })
            .as_ref()
        );
        assert_eq!(exp.get(3), None);
    }

    #[test]
    fn diff_of_lists_with_concurrent_deletes_and_puts() {
        let mut doc1 = AutoCommit::default();
        let list = doc1.put_object(ROOT, "list", ObjType::List).unwrap();

        doc1.insert(&list, 0, 10).unwrap();
        doc1.insert(&list, 1, 20).unwrap();
        doc1.insert(&list, 2, 30).unwrap();
        doc1.insert(&list, 3, 40).unwrap();
        doc1.insert(&list, 4, 50).unwrap();
        doc1.insert(&list, 5, 60).unwrap();

        let heads1 = doc1.get_heads();

        let mut doc2 = doc1.fork();
        let mut doc3 = doc1.fork();

        doc2.put(&list, 3, "A").unwrap();
        doc2.put(&list, 3, "B").unwrap();
        doc2.put(&list, 3, "C").unwrap();
        doc2.put(&list, 4, "!").unwrap();
        doc2.delete(&list, 4).unwrap();

        let heads1a = doc2.get_heads();

        doc3.put(&list, 3, "!").unwrap();
        doc3.delete(&list, 3).unwrap();
        doc3.put(&list, 3, "X").unwrap();
        doc3.put(&list, 3, "Y").unwrap();
        doc3.put(&list, 3, "Z").unwrap();

        let heads1b = doc3.get_heads();

        doc1.merge(&mut doc2).unwrap();
        doc1.merge(&mut doc3).unwrap();

        let heads2 = doc1.get_heads();

        let patches = doc1.diff(&heads1, &heads2);
        let exp1 = exp(patches);
        assert_eq!(
            exp1.get(0),
            Some(ObservedPatch {
                path: "/list/3".into(),
                action: ObservedAction::PutSeq {
                    value: ScalarValue::Str("C".into()).into(),
                    conflict: false,
                },
            })
            .as_ref()
        );
        assert_eq!(
            exp1.get(1),
            Some(ObservedPatch {
                path: "/list/4".into(),
                action: ObservedAction::PutSeq {
                    value: ScalarValue::Str("Z".into()).into(),
                    conflict: false,
                },
            })
            .as_ref()
        );

        let patches = doc1.diff(&heads1a, &heads2);
        let exp2 = exp(patches);
        assert_eq!(
            exp2.get(0),
            Some(ObservedPatch {
                path: "/list/4".into(),
                action: ObservedAction::Insert {
                    values: vec![ScalarValue::Str("Z".into()).into()],
                },
            })
            .as_ref()
        );

        let patches = doc1.diff(&heads1b, &heads2);
        let exp3 = exp(patches);
        assert_eq!(
            exp3.get(0),
            Some(ObservedPatch {
                path: "/list/3".into(),
                action: ObservedAction::Insert {
                    values: vec![ScalarValue::Str("C".into()).into()],
                }
            })
            .as_ref()
        );
    }

    #[test]
    fn diff_counter_exposed() {
        let mut doc1 = AutoCommit::default();
        doc1.put(ROOT, "key", "x").unwrap();

        let mut doc2 = doc1.fork();
        let mut doc3 = doc1.fork();

        doc2.put(ROOT, "key", ScalarValue::counter(10)).unwrap();

        doc1.merge(&mut doc2).unwrap();

        let heads1 = doc1.get_heads();

        doc2.increment(ROOT, "key", 1).unwrap();
        doc2.increment(ROOT, "key", 1).unwrap();

        doc3.put(ROOT, "key", 1).unwrap();
        doc3.put(ROOT, "key", 2).unwrap();
        doc3.put(ROOT, "key", 3).unwrap();
        doc3.put(ROOT, "key", 4).unwrap();

        doc1.merge(&mut doc2).unwrap();
        doc1.merge(&mut doc3).unwrap();

        doc2.increment(ROOT, "key", 1).unwrap();
        doc2.increment(ROOT, "key", 1).unwrap();

        let heads2a = doc1.get_heads();

        doc3.delete(ROOT, "key").unwrap();
        doc1.merge(&mut doc3).unwrap();

        let heads2b = doc1.get_heads();

        let patches = doc1.diff(&heads1, &heads2a);
        let exp1 = exp(patches);
        assert_eq!(
            exp1.get(0),
            Some(ObservedPatch {
                path: "/key".into(),
                action: ObservedAction::PutMap {
                    value: ScalarValue::Int(4).into(),
                    conflict: true,
                },
            })
            .as_ref()
        );

        let patches = doc1.diff(&heads2a, &heads2b);
        let exp1 = exp(patches);
        assert_eq!(
            exp1.get(0),
            Some(ObservedPatch {
                path: "/key".into(),
                action: ObservedAction::PutMap {
                    value: ScalarValue::Counter(12.into()).into(),
                    conflict: false,
                },
            })
            .as_ref()
        );
    }

    #[test]
    fn simple_marks() {
        let mut doc1 = AutoCommit::default();
        let text = doc1.put_object(ROOT, "text", ObjType::Text).unwrap();
        doc1.splice_text(&text, 0, 0, "the quick fox jumps over the lazy dog")
            .unwrap();
        let heads1 = doc1.get_heads();
        doc1.mark(
            text,
            Mark::new("bold".into(), ScalarValue::Boolean(true), 3, 6),
            crate::marks::ExpandMark::After,
        )
        .unwrap();

        let heads2 = doc1.get_heads();
        let patches12 = doc1.diff(&heads1, &heads2);
        let exp1 = exp(patches12);
        assert_eq!(
            exp1,
            vec![ObservedPatch {
                path: "/text".into(),
                action: ObservedAction::Mark(vec![ObservedMark {
                    start: 3,
                    end: 6,
                    name: "bold".to_string(),
                    value: ScalarValue::Boolean(true),
                }]),
            }]
        );

        let patches21 = doc1.diff(&heads2, &heads1);
        let exp2 = exp(patches21);
        assert_eq!(
            exp2,
            vec![ObservedPatch {
                path: "/text".into(),
                action: ObservedAction::Mark(vec![ObservedMark {
                    start: 3,
                    end: 6,
                    name: "bold".to_string(),
                    value: ScalarValue::Null,
                }]),
            }]
        );
    }
}
