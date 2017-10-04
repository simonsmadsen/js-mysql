'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFieldDeleteQuery = createFieldDeleteQuery;
//ALTER TABLE tbl_Country DROP IsDeleted1
const iterateKeyValues = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key]);
  });
};

function createFieldDeleteQuery(table, fields, databaseFields) {
  let query = '';
  const deletedFieldFilter = dbField => Object.keys(fields).indexOf(dbField) === -1;

  const deletedFields = databaseFields.map(f => f.Field).filter(deletedFieldFilter);

  deletedFields.forEach(f => query += 'ALTER TABLE ' + table + ' DROP ' + f + ' ; ');
  return query;
}