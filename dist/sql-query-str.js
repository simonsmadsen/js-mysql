'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const insert = exports.insert = (table, fields, values) => 'Insert into ' + table + ' (' + fields + ') Values (' + values + ')';

const hasWhereInWhere = where => where.toLower().indexOf('where') > -1 ? true : false;

const update = exports.update = (table, fieldValuePairs, where) => 'UPDATE ' + table + ' SET ' + fieldValuePairs + (where ? where : '');

const select = exports.select = (table, where) => 'SELECT * FROM ' + table + ' ' + where;

const _delete = exports._delete = (table, where) => 'DELETE FROM ' + table + ' ' + where;