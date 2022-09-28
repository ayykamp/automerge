import * as tt from "automerge-types"
import * as assert from 'assert'
import * as util from 'util'
import * as Automerge from '../src'

describe('Automerge', () => {
    describe('basics', () => {
        it('should init clone and free', () => {
            let doc1 = Automerge.init()
            let doc2 = Automerge.clone(doc1);
        })

        it('handle basic set and read on root object', () => {
            let doc1 = Automerge.init()
            let doc2 = Automerge.change(doc1, (d) => {
              d.hello = "world"
              d.big = "little"
              d.zip = "zop"
              d.app = "dap"
            assert.deepEqual(d, {  hello: "world", big: "little", zip: "zop", app: "dap" })
            })
            assert.deepEqual(doc2, {  hello: "world", big: "little", zip: "zop", app: "dap" })
        })

        it('handle basic sets over many changes', () => {
            let doc1 = Automerge.init()
            let timestamp = new Date();
            let counter = new Automerge.Counter(100);
            let bytes = new Uint8Array([10,11,12]);
            let doc2 = Automerge.change(doc1, (d) => {
              d.hello = "world"
            })
            let doc3 = Automerge.change(doc2, (d) => {
              d.counter1 = counter
            })
            let doc4 = Automerge.change(doc3, (d) => {
              d.timestamp1 = timestamp
            })
            let doc5 = Automerge.change(doc4, (d) => {
              d.app = null
            })
            let doc6 = Automerge.change(doc5, (d) => {
              d.bytes1 = bytes
            })
            let doc7 = Automerge.change(doc6, (d) => {
              d.uint = new Automerge.Uint(1)
              d.int = new Automerge.Int(-1)
              d.float64 = new Automerge.Float64(5.5)
              d.number1 = 100
              d.number2 = -45.67
              d.true = true
              d.false = false
            })

            assert.deepEqual(doc7, {  hello: "world", true: true, false: false, int: -1, uint: 1, float64: 5.5, number1: 100, number2: -45.67, counter1: counter, timestamp1: timestamp, bytes1: bytes, app: null })

            let changes = Automerge.getAllChanges(doc7)
            let t1 = Automerge.init()
            ;let [t2] = Automerge.applyChanges(t1, changes)
            assert.deepEqual(doc7,t2)
        })

        it('handle overwrites to values', () => {
            let doc1 = Automerge.init()
            let doc2 = Automerge.change(doc1, (d) => {
              d.hello = "world1"
            })
            let doc3 = Automerge.change(doc2, (d) => {
              d.hello = "world2"
            })
            let doc4 = Automerge.change(doc3, (d) => {
              d.hello = "world3"
            })
            let doc5 = Automerge.change(doc4, (d) => {
              d.hello = "world4"
            })
            assert.deepEqual(doc5, {  hello: "world4" } )
        })

        it('handle set with object value', () => {
            let doc1 = Automerge.init()
            let doc2 = Automerge.change(doc1, (d) => {
              d.subobj = { hello: "world", subsubobj: { zip: "zop" } }
            })
            assert.deepEqual(doc2, { subobj:  { hello: "world", subsubobj: { zip: "zop" } } })
        })

        it('handle simple list creation', () => {
            let doc1 = Automerge.init()
            let doc2 = Automerge.change(doc1, (d) => d.list = [])
            assert.deepEqual(doc2, { list: []})
        })

        it('handle simple lists', () => {
            let doc1 = Automerge.init()
            let doc2 = Automerge.change(doc1, (d) => {
              d.list = [ 1, 2, 3 ]
            })
            assert.deepEqual(doc2.list.length, 3)
            assert.deepEqual(doc2.list[0], 1)
            assert.deepEqual(doc2.list[1], 2)
            assert.deepEqual(doc2.list[2], 3)
            assert.deepEqual(doc2, { list: [1,2,3] })
           // assert.deepStrictEqual(Automerge.toJS(doc2), { list: [1,2,3] })

            let doc3 = Automerge.change(doc2, (d) => {
              d.list[1] = "a"
            })

            assert.deepEqual(doc3.list.length, 3)
            assert.deepEqual(doc3.list[0], 1)
            assert.deepEqual(doc3.list[1], "a")
            assert.deepEqual(doc3.list[2], 3)
            assert.deepEqual(doc3, { list: [1,"a",3] })
        })
        it('handle simple lists', () => {
            let doc1 = Automerge.init()
            let doc2 = Automerge.change(doc1, (d) => {
              d.list = [ 1, 2, 3 ]
            })
            let changes = Automerge.getChanges(doc1, doc2)
            let docB1 = Automerge.init()
            ;let [docB2] = Automerge.applyChanges(docB1, changes)
            assert.deepEqual(docB2, doc2);
        })
        it('handle text', () => {
            let doc1 = Automerge.init()
            let tmp = new Automerge.Text("hello")
            let doc2 = Automerge.change(doc1, (d) => {
              d.list = new Automerge.Text("hello")
              d.list.insertAt(2,"Z")
            })
            let changes = Automerge.getChanges(doc1, doc2)
            let docB1 = Automerge.init()
            ;let [docB2] = Automerge.applyChanges(docB1, changes)
            assert.deepEqual(docB2, doc2);
        })

        it('have many list methods', () => {
            let doc1 = Automerge.from({ list: [1,2,3] })
            assert.deepEqual(doc1, { list: [1,2,3] });
            let doc2 = Automerge.change(doc1, (d) => {
              d.list.splice(1,1,9,10)
            })
            assert.deepEqual(doc2, { list: [1,9,10,3] });
            let doc3 = Automerge.change(doc2, (d) => {
              d.list.push(11,12)
            })
            assert.deepEqual(doc3, { list: [1,9,10,3,11,12] });
            let doc4 = Automerge.change(doc3, (d) => {
              d.list.unshift(2,2)
            })
            assert.deepEqual(doc4, { list: [2,2,1,9,10,3,11,12] });
            let doc5 = Automerge.change(doc4, (d) => {
              d.list.shift()
            })
            assert.deepEqual(doc5, { list: [2,1,9,10,3,11,12] });
            let doc6 = Automerge.change(doc5, (d) => {
              d.list.insertAt(3,100,101)
            })
            assert.deepEqual(doc6, { list: [2,1,9,100,101,10,3,11,12] });
        })

        it('allows access to the backend', () => {
          let doc = Automerge.init()
          assert.deepEqual(Object.keys(Automerge.getBackend(doc)), ["ptr"])
        })

        it('lists and text have indexof', () => {
          let doc = Automerge.from({ list: [0,1,2,3,4,5,6], text: new Automerge.Text("hello world") })
          console.log(doc.list.indexOf(5))
          console.log(doc.text.indexOf("world"))
        })
    })

    describe('proxy lists', () => {
        it('behave like arrays', () => {
          let doc = Automerge.from({
            chars: ["a","b","c"],
            numbers: [20,3,100],
            repeats: [20,20,3,3,3,3,100,100]
          })
          let r1 = []
          doc = Automerge.change(doc, (d) => {
            assert.deepEqual(d.chars.concat([1,2]), ["a","b","c",1,2])
            assert.deepEqual(d.chars.map((n) => n + "!"), ["a!", "b!", "c!"])
            assert.deepEqual(d.numbers.map((n) => n + 10), [30, 13, 110])
            assert.deepEqual(d.numbers.toString(), "20,3,100")
            assert.deepEqual(d.numbers.toLocaleString(), "20,3,100")
            assert.deepEqual(d.numbers.forEach((n) => r1.push(n)), undefined)
            assert.deepEqual(d.numbers.every((n) => n > 1), true)
            assert.deepEqual(d.numbers.every((n) => n > 10), false)
            assert.deepEqual(d.numbers.filter((n) => n > 10), [20,100])
            assert.deepEqual(d.repeats.find((n) => n < 10), 3)
            assert.deepEqual(d.repeats.toArray().find((n) => n < 10), 3)
            assert.deepEqual(d.repeats.find((n) => n < 0), undefined)
            assert.deepEqual(d.repeats.findIndex((n) => n < 10), 2)
            assert.deepEqual(d.repeats.findIndex((n) => n < 0), -1)
            assert.deepEqual(d.repeats.toArray().findIndex((n) => n < 10), 2)
            assert.deepEqual(d.repeats.toArray().findIndex((n) => n < 0), -1)
            assert.deepEqual(d.numbers.includes(3), true)
            assert.deepEqual(d.numbers.includes(-3), false)
            assert.deepEqual(d.numbers.join("|"), "20|3|100")
            assert.deepEqual(d.numbers.join(), "20,3,100")
            assert.deepEqual(d.numbers.some((f) => f === 3), true)
            assert.deepEqual(d.numbers.some((f) => f < 0), false)
            assert.deepEqual(d.numbers.reduce((sum,n) => sum + n, 100), 223)
            assert.deepEqual(d.repeats.reduce((sum,n) => sum + n, 100), 352)
            assert.deepEqual(d.chars.reduce((sum,n) => sum + n, "="), "=abc")
            assert.deepEqual(d.chars.reduceRight((sum,n) => sum + n, "="), "=cba")
            assert.deepEqual(d.numbers.reduceRight((sum,n) => sum + n, 100), 223)
            assert.deepEqual(d.repeats.lastIndexOf(3), 5)
            assert.deepEqual(d.repeats.lastIndexOf(3,3), 3)
          })
          doc = Automerge.change(doc, (d) => {
            assert.deepEqual(d.numbers.fill(-1,1,2), [20,-1,100])
            assert.deepEqual(d.chars.fill("z",1,100), ["a","z","z"])
          })
          assert.deepEqual(r1, [20,3,100])
          assert.deepEqual(doc.numbers, [20,-1,100])
          assert.deepEqual(doc.chars, ["a","z","z"])
        })
    })
    
    it('should obtain the same conflicts, regardless of merge order', () => {
      let s1 = Automerge.init()
      let s2 = Automerge.init()
      s1 = Automerge.change<any>(s1, doc => { doc.x = 1; doc.y = 2 })
      s2 = Automerge.change<any>(s2, doc => { doc.x = 3; doc.y = 4 })
      const m1 = Automerge.merge(Automerge.clone(s1), Automerge.clone(s2))
      const m2 = Automerge.merge(Automerge.clone(s2), Automerge.clone(s1))
      assert.deepStrictEqual(Automerge.getConflicts(m1, 'x'), Automerge.getConflicts(m2, 'x'))
    })
})

