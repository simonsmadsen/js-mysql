'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.find = find;
exports.update = update;
exports._delete = _delete;
exports.select = select;
exports.raw = raw;
exports.now = now;
exports.filterObject = filterObject;

var _getMysqlConnection = require('./get-mysql-connection');

var _getMysqlConnection2 = _interopRequireDefault(_getMysqlConnection);

var _sqlQueryStr = require('./sql-query-str');

var sql = _interopRequireWildcard(_sqlQueryStr);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const quote = str => '\'' + str + '\'';
const formatDate = date => date.toISOString().slice(0, 19).replace('T', ' ');
const createDate = _ => formatDate(new Date());

const quoteIfStrOrDate = str => typeof str == 'string' ? quote(str) : typeof str == 'object' ? quote(formatDate(str)) : str;

const whereStr = where => where.indexOf('where') > -1 ? where : ' WHERE ' + where;

const whereObj = where => Object.keys(where).map(key => {
  return key + ' = ' + quoteIfStrOrDate(where[key]);
}).join(' AND ');

const handleSoftDelete = where => _config2.default.mysql_soft_delete === '1' ? where.toLowerCase().replace('where', '').trim().length > 0 ? where + ' AND ' + _config2.default.mysql_soft_delete_field + ' = 0 ' : _config2.default.mysql_soft_delete_field + ' = 0 ' : where;

const ensureWhere = where => where.trim().length > 0 ? where.trim().toLowerCase().indexOf('where') > -1 ? where : ' WHERE ' + where : '';
const prepareWhere = where => ensureWhere(handleSoftDelete(typeof where == 'string' ? whereStr(where) : ' WHERE ' + whereObj(where)));

const sqlFields = obj => Object.keys(obj).join();
const sqlValues = obj => Object.values(obj).map(quoteIfStrOrDate).join();

const objectToCreateQuery = (table, obj) => sql.insert(table, sqlFields(obj), sqlValues(obj));

const queryCreate = (table, obj) => conn => conn.query(objectToCreateQuery(table, obj));

const runQuery = query => conn => conn.query(query);

const takeFirst = queryResult => queryResult[0].length > 0 ? queryResult[0][0] : {};

function create(table, obj) {
  return (0, _getMysqlConnection2.default)().then(queryCreate(table, obj));
}

function find(table, where) {
  return (0, _getMysqlConnection2.default)().then(runQuery(sql.select(table, prepareWhere(where)))).then(takeFirst);
}

const prepareUpdate = updates => Object.keys(updates).map(key => {
  return key + ' = ' + quoteIfStrOrDate(updates[key]) + ' ';
}).join(' , ');

const prepareLimit = limig => limit ? ' Limit ' + limit : '';

function update(table, updates, where) {
  return (0, _getMysqlConnection2.default)().then(runQuery(sql.update(table, prepareUpdate(updates), prepareWhere(where)))).then(r => r[0]);
}

function _delete(table, where) {
  if (_config2.default.mysql_soft_delete === '0') {
    return (0, _getMysqlConnection2.default)().then(runQuery(sql._delete(table, prepareWhere(where))));
  } else {
    const deleteField = _config2.default.mysql_soft_delete_field;
    const updates = {};
    updates[deleteField] = 1;
    return (0, _getMysqlConnection2.default)().then(runQuery(sql.update(table, prepareUpdate(updates), prepareWhere(where)))).then(r => r[0]);
  }
}

function select(table, where, limit) {
  return (0, _getMysqlConnection2.default)().then(runQuery(sql.select(table, prepareWhere(where) + prepareLimit(limit)))).then(r => r[0]);
}

function raw(sqlQuery) {
  return (0, _getMysqlConnection2.default)().then(runQuery(sqlQuery)).then(r => r[0]);
}

function now() {
  return createDate();
}

function filterObject(obj, allowedKeys) {
  const newObj = {};
  Object.keys(obj).forEach(key => {
    if (allowedKeys.indexOf(key) > -1) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}