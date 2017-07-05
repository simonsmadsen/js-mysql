import {filterObject} from './../../src'

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
});
