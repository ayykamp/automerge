(function() {var implementors = {};
implementors["automerge"] = [{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.AutoCommit.html\" title=\"struct automerge::AutoCommit\">AutoCommit</a>","synthetic":true,"types":["automerge::autocommit::AutoCommit"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.Automerge.html\" title=\"struct automerge::Automerge\">Automerge</a>","synthetic":true,"types":["automerge::automerge::Automerge"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.Change.html\" title=\"struct automerge::Change\">Change</a>","synthetic":true,"types":["automerge::change::Change"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.DecodingError.html\" title=\"enum automerge::DecodingError\">Error</a>","synthetic":true,"types":["automerge::decoding::Error"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.InvalidChangeError.html\" title=\"enum automerge::InvalidChangeError\">InvalidChangeError</a>","synthetic":true,"types":["automerge::decoding::InvalidChangeError"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.EncodingError.html\" title=\"enum automerge::EncodingError\">Error</a>","synthetic":true,"types":["automerge::encoding::Error"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.AutomergeError.html\" title=\"enum automerge::AutomergeError\">AutomergeError</a>","synthetic":true,"types":["automerge::error::AutomergeError"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.ObjId.html\" title=\"enum automerge::ObjId\">ExId</a>","synthetic":true,"types":["automerge::exid::ExId"]},{"text":"impl&lt;'a, 'k&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.Keys.html\" title=\"struct automerge::Keys\">Keys</a>&lt;'a, 'k&gt;","synthetic":true,"types":["automerge::keys::Keys"]},{"text":"impl&lt;'a, 'k&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.KeysAt.html\" title=\"struct automerge::KeysAt\">KeysAt</a>&lt;'a, 'k&gt;","synthetic":true,"types":["automerge::keys_at::KeysAt"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.ExpandedChange.html\" title=\"struct automerge::ExpandedChange\">Change</a>","synthetic":true,"types":["automerge::legacy::Change"]},{"text":"impl&lt;'a, R&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.ListRange.html\" title=\"struct automerge::ListRange\">ListRange</a>&lt;'a, R&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>,&nbsp;</span>","synthetic":true,"types":["automerge::list_range::ListRange"]},{"text":"impl&lt;'a, R&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.ListRangeAt.html\" title=\"struct automerge::ListRangeAt\">ListRangeAt</a>&lt;'a, R&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>,&nbsp;</span>","synthetic":true,"types":["automerge::list_range_at::ListRangeAt"]},{"text":"impl&lt;'a, R&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.MapRange.html\" title=\"struct automerge::MapRange\">MapRange</a>&lt;'a, R&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>,&nbsp;</span>","synthetic":true,"types":["automerge::map_range::MapRange"]},{"text":"impl&lt;'a, R&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.MapRangeAt.html\" title=\"struct automerge::MapRangeAt\">MapRangeAt</a>&lt;'a, R&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;R: <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>,&nbsp;</span>","synthetic":true,"types":["automerge::map_range_at::MapRangeAt"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.VecOpObserver.html\" title=\"struct automerge::VecOpObserver\">VecOpObserver</a>","synthetic":true,"types":["automerge::op_observer::VecOpObserver"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.Patch.html\" title=\"enum automerge::Patch\">Patch</a>","synthetic":true,"types":["automerge::op_observer::Patch"]},{"text":"impl&lt;'a, Obs&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.ApplyOptions.html\" title=\"struct automerge::ApplyOptions\">ApplyOptions</a>&lt;'a, Obs&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;Obs: <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>,&nbsp;</span>","synthetic":true,"types":["automerge::options::ApplyOptions"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.Parents.html\" title=\"struct automerge::Parents\">Parents</a>&lt;'a&gt;","synthetic":true,"types":["automerge::parents::Parents"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/sync/struct.BloomFilter.html\" title=\"struct automerge::sync::BloomFilter\">BloomFilter</a>","synthetic":true,"types":["automerge::sync::bloom::BloomFilter"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/sync/struct.State.html\" title=\"struct automerge::sync::State\">State</a>","synthetic":true,"types":["automerge::sync::state::State"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/sync/struct.Have.html\" title=\"struct automerge::sync::Have\">Have</a>","synthetic":true,"types":["automerge::sync::state::Have"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/sync/struct.Message.html\" title=\"struct automerge::sync::Message\">Message</a>","synthetic":true,"types":["automerge::sync::Message"]},{"text":"impl&lt;'a, Obs&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/transaction/struct.CommitOptions.html\" title=\"struct automerge::transaction::CommitOptions\">CommitOptions</a>&lt;'a, Obs&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;Obs: <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>,&nbsp;</span>","synthetic":true,"types":["automerge::transaction::commit::CommitOptions"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/transaction/struct.Transaction.html\" title=\"struct automerge::transaction::Transaction\">Transaction</a>&lt;'a&gt;","synthetic":true,"types":["automerge::transaction::manual_transaction::Transaction"]},{"text":"impl&lt;O&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/transaction/struct.Success.html\" title=\"struct automerge::transaction::Success\">Success</a>&lt;O&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;O: <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>,&nbsp;</span>","synthetic":true,"types":["automerge::transaction::result::Success"]},{"text":"impl&lt;E&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/transaction/struct.Failure.html\" title=\"struct automerge::transaction::Failure\">Failure</a>&lt;E&gt; <span class=\"where fmt-newline\">where<br>&nbsp;&nbsp;&nbsp;&nbsp;E: <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a>,&nbsp;</span>","synthetic":true,"types":["automerge::transaction::result::Failure"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.ActorId.html\" title=\"struct automerge::ActorId\">ActorId</a>","synthetic":true,"types":["automerge::types::ActorId"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.ObjType.html\" title=\"enum automerge::ObjType\">ObjType</a>","synthetic":true,"types":["automerge::types::ObjType"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.OpType.html\" title=\"enum automerge::OpType\">OpType</a>","synthetic":true,"types":["automerge::types::OpType"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.Prop.html\" title=\"enum automerge::Prop\">Prop</a>","synthetic":true,"types":["automerge::types::Prop"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.ChangeHash.html\" title=\"struct automerge::ChangeHash\">ChangeHash</a>","synthetic":true,"types":["automerge::types::ChangeHash"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":true,"types":["automerge::value::Value"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":true,"types":["automerge::value::ScalarValue"]},{"text":"impl&lt;'a&gt; !<a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge/struct.Values.html\" title=\"struct automerge::Values\">Values</a>&lt;'a&gt;","synthetic":true,"types":["automerge::values::Values"]}];
implementors["automerge_wasm"] = [{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.60.0/core/marker/trait.Send.html\" title=\"trait core::marker::Send\">Send</a> for <a class=\"struct\" href=\"automerge_wasm/struct.Automerge.html\" title=\"struct automerge_wasm::Automerge\">Automerge</a>","synthetic":true,"types":["automerge_wasm::Automerge"]}];
if (window.register_implementors) {window.register_implementors(implementors);} else {window.pending_implementors = implementors;}})()