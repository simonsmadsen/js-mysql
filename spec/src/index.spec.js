import {filterObject,select,table,now,sharedConnection} from './../../src'

describe("filter object", function() {
  it("object", function() {
      const obj = {
        key1: '1',
        key2: '2',
        key3: '3',
        key4: '4'
      }
      expect(Object.keys(filterObject(obj,['key1','key2'])).length).toBe(2);
  });
  it("select", function(done) {

    const _table = table('web_tests')
    //_table.create({name:'bandi!',created_at: now(),deleted:false})
    //_table.find({id:1})
    //_table.delete('id > 3')
    _table.select(null,'id desc',2)
    .then(r => {
      console.log(r)
      done()
    })
    .catch((err) => {console.log(err)})

  })
})
