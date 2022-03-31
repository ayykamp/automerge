use crate::object_data::{MapOpsCache, SeqOpsCache};
use crate::op_tree::{OpSetMetadata, OpTreeNode};
use crate::types::{Clock, Counter, ElemId, Op, OpId, OpType, ScalarValue};
use fxhash::FxBuildHasher;
use std::cmp::Ordering;
use std::collections::{HashMap, HashSet};
use std::fmt::Debug;

mod elem_id_pos;
mod insert;
mod keys;
mod keys_at;
mod len;
mod len_at;
mod list_vals;
mod list_vals_at;
mod nth;
mod nth_at;
mod opid;
mod prop;
mod prop_at;
mod range;
mod range_at;
mod seek_op;
mod seek_op_with_patch;

pub(crate) use elem_id_pos::ElemIdPos;
pub(crate) use insert::InsertNth;
pub(crate) use keys::Keys;
pub(crate) use keys_at::KeysAt;
pub(crate) use len::Len;
pub(crate) use len_at::LenAt;
pub(crate) use list_vals::ListVals;
pub(crate) use list_vals_at::ListValsAt;
pub(crate) use nth::Nth;
pub(crate) use nth_at::NthAt;
pub(crate) use opid::OpIdSearch;
pub(crate) use prop::Prop;
pub(crate) use prop_at::PropAt;
pub(crate) use range::Range;
pub(crate) use range_at::RangeAt;
pub(crate) use seek_op::SeekOp;
pub(crate) use seek_op_with_patch::SeekOpWithPatch;

#[derive(Debug, Clone, PartialEq)]
pub(crate) struct CounterData {
    pos: usize,
    val: i64,
    succ: HashSet<OpId>,
    op: Op,
}

pub(crate) trait TreeQuery<'a> {
    fn cache_lookup_map(&mut self, _cache: &MapOpsCache) -> bool {
        // by default we haven't found something in the cache
        false
    }

    fn cache_update_map(&self, _cache: &mut MapOpsCache) {
        // by default we don't have anything to update in the cache
    }

    fn cache_lookup_seq(&mut self, _cache: &SeqOpsCache) -> bool {
        // by default we haven't found something in the cache
        false
    }

    fn cache_update_seq(&self, _cache: &mut SeqOpsCache) {
        // by default we don't have anything to update in the cache
    }

    #[inline(always)]
    fn query_node_with_metadata(
        &mut self,
        child: &'a OpTreeNode,
        _m: &OpSetMetadata,
    ) -> QueryResult {
        self.query_node(child)
    }

    fn query_node(&mut self, _child: &'a OpTreeNode) -> QueryResult {
        QueryResult::Descend
    }

    #[inline(always)]
    fn query_element_with_metadata(&mut self, element: &'a Op, _m: &OpSetMetadata) -> QueryResult {
        self.query_element(element)
    }

    fn query_element(&mut self, _element: &'a Op) -> QueryResult {
        panic!("invalid element query")
    }
}

#[derive(Debug, Clone, PartialEq)]
pub(crate) enum QueryResult {
    Next,
    Descend,
    Finish,
}

#[derive(Clone, Debug, PartialEq)]
pub(crate) struct Index {
    /// The map of visible elements to the number of operations targetting them.
    pub(crate) visible: HashMap<ElemId, usize, FxBuildHasher>,
    /// Set of opids found in this node and below.
    pub(crate) ops: HashSet<OpId, FxBuildHasher>,
}

impl Index {
    pub(crate) fn new() -> Self {
        Index {
            visible: Default::default(),
            ops: Default::default(),
        }
    }

    /// Get the number of visible elements in this index.
    pub(crate) fn visible_len(&self) -> usize {
        self.visible.len()
    }

    pub(crate) fn has_visible(&self, e: &Option<ElemId>) -> bool {
        if let Some(seen) = e {
            self.visible.contains_key(seen)
        } else {
            false
        }
    }

    pub(crate) fn replace(&mut self, old: &Op, new: &Op) {
        if old.id != new.id {
            self.ops.remove(&old.id);
            self.ops.insert(new.id);
        }

        assert!(new.key == old.key);

        match (new.visible(), old.visible(), new.elemid()) {
            (false, true, Some(elem)) => match self.visible.get(&elem).copied() {
                Some(n) if n == 1 => {
                    self.visible.remove(&elem);
                }
                Some(n) => {
                    self.visible.insert(elem, n - 1);
                }
                None => panic!("remove overun in index"),
            },
            (true, false, Some(elem)) => *self.visible.entry(elem).or_default() += 1,
            _ => {}
        }
    }

    pub(crate) fn insert(&mut self, op: &Op) {
        self.ops.insert(op.id);
        if op.visible() {
            if let Some(elem) = op.elemid() {
                *self.visible.entry(elem).or_default() += 1;
            }
        }
    }

    pub(crate) fn remove(&mut self, op: &Op) {
        self.ops.remove(&op.id);
        if op.visible() {
            if let Some(elem) = op.elemid() {
                match self.visible.get(&elem).copied() {
                    Some(n) if n == 1 => {
                        self.visible.remove(&elem);
                    }
                    Some(n) => {
                        self.visible.insert(elem, n - 1);
                    }
                    None => panic!("remove overun in index"),
                }
            }
        }
    }

    pub(crate) fn merge(&mut self, other: &Index) {
        for id in &other.ops {
            self.ops.insert(*id);
        }
        for (elem, n) in other.visible.iter() {
            *self.visible.entry(*elem).or_default() += n;
        }
    }
}

impl Default for Index {
    fn default() -> Self {
        Self::new()
    }
}

#[derive(Debug, Clone, PartialEq, Default)]
pub(crate) struct VisWindow {
    counters: HashMap<OpId, CounterData>,
}

impl VisWindow {
    fn visible_at(&mut self, op: &Op, pos: usize, clock: &Clock) -> bool {
        if !clock.covers(&op.id) {
            return false;
        }

        let mut visible = false;
        match op.action {
            OpType::Put(ScalarValue::Counter(Counter { start, .. })) => {
                self.counters.insert(
                    op.id,
                    CounterData {
                        pos,
                        val: start,
                        succ: op.succ.iter().cloned().collect(),
                        op: op.clone(),
                    },
                );
                if !op.succ.iter().any(|i| clock.covers(i)) {
                    visible = true;
                }
            }
            OpType::Increment(inc_val) => {
                for id in &op.pred {
                    // pred is always before op.id so we can see them
                    if let Some(mut entry) = self.counters.get_mut(id) {
                        entry.succ.remove(&op.id);
                        entry.val += inc_val;
                        entry.op.action = OpType::Put(ScalarValue::counter(entry.val));
                        if !entry.succ.iter().any(|i| clock.covers(i)) {
                            visible = true;
                        }
                    }
                }
            }
            _ => {
                if !op.succ.iter().any(|i| clock.covers(i)) {
                    visible = true;
                }
            }
        };
        visible
    }

    pub(crate) fn seen_op(&self, op: &Op, pos: usize) -> Vec<(usize, Op)> {
        let mut result = vec![];
        for pred in &op.pred {
            if let Some(entry) = self.counters.get(pred) {
                result.push((entry.pos, entry.op.clone()));
            }
        }
        if result.is_empty() {
            result.push((pos, op.clone()));
        }
        result
    }
}

pub(crate) fn binary_search_by<F>(node: &OpTreeNode, f: F) -> usize
where
    F: Fn(&Op) -> Ordering,
{
    let mut right = node.len();
    let mut left = 0;
    while left < right {
        let seq = (left + right) / 2;
        if f(node.get(seq).unwrap()) == Ordering::Less {
            left = seq + 1;
        } else {
            right = seq;
        }
    }
    left
}
