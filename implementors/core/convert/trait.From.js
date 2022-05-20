(function() {var implementors = {};
implementors["automerge"] = [{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"automerge/struct.ExpandedChange.html\" title=\"struct automerge::ExpandedChange\">Change</a>&gt; for <a class=\"struct\" href=\"automerge/struct.Change.html\" title=\"struct automerge::Change\">Change</a>","synthetic":false,"types":["automerge::change::Change"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'_ <a class=\"struct\" href=\"automerge/struct.ExpandedChange.html\" title=\"struct automerge::ExpandedChange\">Change</a>&gt; for <a class=\"struct\" href=\"automerge/struct.Change.html\" title=\"struct automerge::Change\">Change</a>","synthetic":false,"types":["automerge::change::Change"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"enum\" href=\"automerge/enum.InvalidChangeError.html\" title=\"enum automerge::InvalidChangeError\">InvalidChangeError</a>&gt; for <a class=\"enum\" href=\"automerge/enum.DecodingError.html\" title=\"enum automerge::DecodingError\">Error</a>","synthetic":false,"types":["automerge::decoding::Error"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;Error&gt; for <a class=\"enum\" href=\"automerge/enum.DecodingError.html\" title=\"enum automerge::DecodingError\">Error</a>","synthetic":false,"types":["automerge::decoding::Error"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt; for <a class=\"enum\" href=\"automerge/enum.DecodingError.html\" title=\"enum automerge::DecodingError\">Error</a>","synthetic":false,"types":["automerge::decoding::Error"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/std/io/error/struct.Error.html\" title=\"struct std::io::error::Error\">Error</a>&gt; for <a class=\"enum\" href=\"automerge/enum.EncodingError.html\" title=\"enum automerge::EncodingError\">Error</a>","synthetic":false,"types":["automerge::encoding::Error"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"enum\" href=\"automerge/enum.EncodingError.html\" title=\"enum automerge::EncodingError\">Error</a>&gt; for <a class=\"enum\" href=\"automerge/enum.AutomergeError.html\" title=\"enum automerge::AutomergeError\">AutomergeError</a>","synthetic":false,"types":["automerge::error::AutomergeError"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"enum\" href=\"automerge/enum.DecodingError.html\" title=\"enum automerge::DecodingError\">Error</a>&gt; for <a class=\"enum\" href=\"automerge/enum.AutomergeError.html\" title=\"enum automerge::AutomergeError\">AutomergeError</a>","synthetic":false,"types":["automerge::error::AutomergeError"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"enum\" href=\"https://docs.rs/hex/0.4.3/hex/error/enum.FromHexError.html\" title=\"enum hex::error::FromHexError\">FromHexError</a>&gt; for <a class=\"enum\" href=\"automerge/enum.AutomergeError.html\" title=\"enum automerge::AutomergeError\">AutomergeError</a>","synthetic":false,"types":["automerge::error::AutomergeError"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"enum\" href=\"automerge/enum.AutomergeError.html\" title=\"enum automerge::AutomergeError\">AutomergeError</a>&gt; for <a class=\"struct\" href=\"https://docs.rs/wasm-bindgen/0.2/wasm_bindgen/struct.JsValue.html\" title=\"struct wasm_bindgen::JsValue\">JsValue</a>","synthetic":false,"types":["wasm_bindgen::JsValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"https://docs.rs/uuid/0.8.2/uuid/struct.Uuid.html\" title=\"struct uuid::Uuid\">Uuid</a>&gt; for <a class=\"struct\" href=\"automerge/struct.ActorId.html\" title=\"struct automerge::ActorId\">ActorId</a>","synthetic":false,"types":["automerge::types::ActorId"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.slice.html\">&amp;'_ [</a><a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u8.html\">u8</a><a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.slice.html\">]</a>&gt; for <a class=\"struct\" href=\"automerge/struct.ActorId.html\" title=\"struct automerge::ActorId\">ActorId</a>","synthetic":false,"types":["automerge::types::ActorId"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'_ <a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/vec/struct.Vec.html\" title=\"struct alloc::vec::Vec\">Vec</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u8.html\">u8</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/alloc/struct.Global.html\" title=\"struct alloc::alloc::Global\">Global</a>&gt;&gt; for <a class=\"struct\" href=\"automerge/struct.ActorId.html\" title=\"struct automerge::ActorId\">ActorId</a>","synthetic":false,"types":["automerge::types::ActorId"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/vec/struct.Vec.html\" title=\"struct alloc::vec::Vec\">Vec</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u8.html\">u8</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/alloc/struct.Global.html\" title=\"struct alloc::alloc::Global\">Global</a>&gt;&gt; for <a class=\"struct\" href=\"automerge/struct.ActorId.html\" title=\"struct automerge::ActorId\">ActorId</a>","synthetic":false,"types":["automerge::types::ActorId"]},{"text":"impl&lt;const N:&nbsp;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.usize.html\">usize</a>&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.array.html\">[</a><a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u8.html\">u8</a><a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.array.html\">; N]</a>&gt; for <a class=\"struct\" href=\"automerge/struct.ActorId.html\" title=\"struct automerge::ActorId\">ActorId</a>","synthetic":false,"types":["automerge::types::ActorId"]},{"text":"impl&lt;const N:&nbsp;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.usize.html\">usize</a>&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'_ <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.array.html\">[</a><a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u8.html\">u8</a><a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.array.html\">; N]</a>&gt; for <a class=\"struct\" href=\"automerge/struct.ActorId.html\" title=\"struct automerge::ActorId\">ActorId</a>","synthetic":false,"types":["automerge::types::ActorId"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"enum\" href=\"automerge/enum.ObjType.html\" title=\"enum automerge::ObjType\">ObjType</a>&gt; for <a class=\"enum\" href=\"automerge/enum.OpType.html\" title=\"enum automerge::OpType\">OpType</a>","synthetic":false,"types":["automerge::types::OpType"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>&gt; for <a class=\"enum\" href=\"automerge/enum.OpType.html\" title=\"enum automerge::OpType\">OpType</a>","synthetic":false,"types":["automerge::types::OpType"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/string/struct.String.html\" title=\"struct alloc::string::String\">String</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Prop.html\" title=\"enum automerge::Prop\">Prop</a>","synthetic":false,"types":["automerge::types::Prop"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'_ <a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/string/struct.String.html\" title=\"struct alloc::string::String\">String</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Prop.html\" title=\"enum automerge::Prop\">Prop</a>","synthetic":false,"types":["automerge::types::Prop"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'_ <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.str.html\">str</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Prop.html\" title=\"enum automerge::Prop\">Prop</a>","synthetic":false,"types":["automerge::types::Prop"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.usize.html\">usize</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Prop.html\" title=\"enum automerge::Prop\">Prop</a>","synthetic":false,"types":["automerge::types::Prop"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.f64.html\">f64</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Prop.html\" title=\"enum automerge::Prop\">Prop</a>","synthetic":false,"types":["automerge::types::Prop"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"enum\" href=\"automerge/enum.Prop.html\" title=\"enum automerge::Prop\">Prop</a>&gt; for <a class=\"struct\" href=\"https://docs.rs/wasm-bindgen/0.2/wasm_bindgen/struct.JsValue.html\" title=\"struct wasm_bindgen::JsValue\">JsValue</a>","synthetic":false,"types":["wasm_bindgen::JsValue"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'_ <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.str.html\">str</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'_ <a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/string/struct.String.html\" title=\"struct alloc::string::String\">String</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/string/struct.String.html\" title=\"struct alloc::string::String\">String</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.char.html\">char</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/vec/struct.Vec.html\" title=\"struct alloc::vec::Vec\">Vec</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u8.html\">u8</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/alloc/struct.Global.html\" title=\"struct alloc::alloc::Global\">Global</a>&gt;&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.f64.html\">f64</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.i64.html\">i64</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.i32.html\">i32</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u32.html\">u32</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u64.html\">u64</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.bool.html\">bool</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.unit.html\">()</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"enum\" href=\"automerge/enum.ObjType.html\" title=\"enum automerge::ObjType\">ObjType</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl&lt;'a&gt; <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>&gt; for <a class=\"enum\" href=\"automerge/enum.Value.html\" title=\"enum automerge::Value\">Value</a>&lt;'a&gt;","synthetic":false,"types":["automerge::value::Value"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'_ <a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.str.html\">str</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;&amp;'_ <a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/string/struct.String.html\" title=\"struct alloc::string::String\">String</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/string/struct.String.html\" title=\"struct alloc::string::String\">String</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/vec/struct.Vec.html\" title=\"struct alloc::vec::Vec\">Vec</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u8.html\">u8</a>, <a class=\"struct\" href=\"https://doc.rust-lang.org/1.61.0/alloc/alloc/struct.Global.html\" title=\"struct alloc::alloc::Global\">Global</a>&gt;&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.i64.html\">i64</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.f64.html\">f64</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u64.html\">u64</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.u32.html\">u32</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.i32.html\">i32</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.bool.html\">bool</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.unit.html\">()</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]},{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"primitive\" href=\"https://doc.rust-lang.org/1.61.0/std/primitive.char.html\">char</a>&gt; for <a class=\"enum\" href=\"automerge/enum.ScalarValue.html\" title=\"enum automerge::ScalarValue\">ScalarValue</a>","synthetic":false,"types":["automerge::value::ScalarValue"]}];
implementors["automerge_wasm"] = [{"text":"impl <a class=\"trait\" href=\"https://doc.rust-lang.org/1.61.0/core/convert/trait.From.html\" title=\"trait core::convert::From\">From</a>&lt;<a class=\"struct\" href=\"automerge_wasm/struct.Automerge.html\" title=\"struct automerge_wasm::Automerge\">Automerge</a>&gt; for <a class=\"struct\" href=\"https://docs.rs/wasm-bindgen/0.2/wasm_bindgen/struct.JsValue.html\" title=\"struct wasm_bindgen::JsValue\">JsValue</a>","synthetic":false,"types":["wasm_bindgen::JsValue"]}];
if (window.register_implementors) {window.register_implementors(implementors);} else {window.pending_implementors = implementors;}})()