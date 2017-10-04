'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.table = table;

var _mysql = require('./../mysql');

var mysql = _interopRequireWildcard(_mysql);

var _sqlQuery = require('./sql-query');

var sql = _interopRequireWildcard(_sqlQuery);

var _createTableQuery = require('./create-table-query');

var _createFieldsQuery = require('./create-fields-query');

var _createFieldUpdateQuery = require('./create-field-update-query');

var _createFieldDeleteQuery = require('./create-field-delete-query');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const l = l => {
  console.log(l);
  return l;
};
const rawQuertIfNotEmpty = query => query.trim().length > 0 ? mysql.raw(query) : 'empty query!';
const createTable = (table, fields) => mysql.raw((0, _createTableQuery.createTableQuery)(table, fields));
const arrNotEmpty = arr => arr.length > 0;
const tableExists = table => mysql.raw(sql.tableExists(table)).then(arrNotEmpty);
const mapDatabaseFields = databaseFields => databaseFields.map(field => field.Field);
const findNewFields = fields => databaseFields => Object.keys(fields).filter(f => databaseFields.indexOf(f) === -1);
const createNewFields = (table, fields) => newFields => (0, _createFieldsQuery.createFieldsQuery)(table, fields, newFields).split(';').forEach(rawQuertIfNotEmpty);

const handleNewFields = (table, fields) => mysql.raw(sql.tableFields(table)).then(mapDatabaseFields).then(findNewFields(fields)).then(createNewFields(table, fields));

const fieldUpdateQuery = (table, fields) => databaseFields => (0, _createFieldUpdateQuery.createFieldUpdateQuery)(table, fields, databaseFields);

const runQueries = queries => queries.split(';').forEach(rawQuertIfNotEmpty);

const handleChangedFields = (table, fields) => oldResult => mysql.raw(sql.tableFields(table)).then(fieldUpdateQuery(table, fields)).then(runQueries);

const fieldDeleteQuery = (table, fields) => databaseFields => (0, _createFieldDeleteQuery.createFieldDeleteQuery)(table, fields, databaseFields);
const handleRemovedFields = (table, fields) => old => mysql.raw(sql.tableFields(table)).then(fieldDeleteQuery(table, fields)).then(runQueries);

const validateFields = (table, fields) => handleNewFields(table, fields).then(handleChangedFields(table, fields)).then(handleRemovedFields(table, fields));

const createOrUpdate = (table, fields) => exists => !exists ? createTable(table, fields) : validateFields(table, fields);

function table(table, fields) {
  return tableExists(table).then(createOrUpdate(table, fields));
}