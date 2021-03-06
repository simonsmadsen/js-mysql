'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = insert;
exports.create = create;
exports.find = find;
exports.update = update;
exports._delete = _delete;
exports.selectCols = selectCols;
exports.selectFields = selectFields;
exports.select = select;
exports.raw = raw;
exports.truncate = truncate;
exports.table = table;
exports.now = now;
exports.sharedConnection = sharedConnection;
exports.filterObject = filterObject;

var _getMysqlConnection = require('./get-mysql-connection');

var _getMysqlConnection2 = _interopRequireDefault(_getMysqlConnection);

var _sqlQueryStr = require('./sql-query-str');

var sql = _interopRequireWildcard(_sqlQueryStr);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const moment = require('moment');

const formatDate = str => moment(str).format('YYYY-MM-DD HH:mm:ss');
const createDate = () => moment().format('YYYY-MM-DD HH:mm:ss');
const prepareLimit = limit => limit > 0 ? ` Limit ${limit}` : '';
const prepareOrder = order => order ? ` Order by ${order}` : '';
const formatBool = bool => bool ? '1' : '0';

const quoteIfStrOrDate = str => typeof str === 'boolean' ? formatBool(str) : typeof str === 'object' ? formatDate(str) : str;

const whereStr = where => where.indexOf('where') > -1 ? where : ` WHERE ${where}`;

const whereObj = where => Object.keys(where).map(key => `${key} = ? `).join(' AND ');

const whereValues = where => !where || typeof where === 'string' ? [] : Object.keys(where).map(key => quoteIfStrOrDate(where[key]));

const handleSoftDelete = where => _config2.default.mysql_soft_delete === 'true' ? where.toLowerCase().replace('where', '').trim().length > 0 ? `${where} AND ${_config2.default.mysql_soft_delete_field} = 0 ` : `${_config2.default.mysql_soft_delete_field} = 0 ` : where;

const ensureWhere = where => where.trim().length > 0 ? where.trim().toLowerCase().indexOf('where') > -1 ? where : ` WHERE ${where}` : '';
const prepareWhere = where => {
  if (where) {
    return ensureWhere(handleSoftDelete(typeof where === 'string' ? whereStr(where) : ` WHERE ${whereObj(where)}`));
  }
  return ensureWhere(handleSoftDelete(''));
};

const sqlFields = obj => Object.keys(obj).join();
const sqlValues = obj => Object.values(obj).map(quoteIfStrOrDate);
const sqlValuesPrepared = obj => Object.values(obj).map(_ => '?').join();

const objectToCreateQuery = (table, obj) => sql.insert(table, sqlFields(obj), sqlValuesPrepared(obj));

const printQuery = (query, vals) => {
  if (_config2.default.mysql_query_debug == 'true') {
    console.log([query, vals]);
  }
  return query;
};

const runQuery = (query, values) => conn => conn.execute(printQuery(query, values), values).then(r => {
  if (!sharedConn) {
    conn.release();
  }
  return r;
});

const queryCreate = (table, obj) => conn => runQuery(objectToCreateQuery(table, obj), sqlValues(obj))(conn);

const takeFirst = queryResult => queryResult[0].length > 0 ? queryResult[0][0] : null;

function insert(table, obj) {
  return create(table, obj);
}

const prepareUpdate = updates => Object.keys(updates).map(key => `${key} = ? `).join(' , ');

const prepareUpdateValues = updates => Object.keys(updates).map(key => quoteIfStrOrDate(updates[key]));

function create(table, obj) {
  return (0, _getMysqlConnection2.default)().then(queryCreate(table, obj)).then(r => r[0].insertId);
}

const removeEmpty = where => Object.keys(where).reduce((res, cur) => {
  if (where[cur]) {
    res[cur] = where[cur];
  }

  return res;
}, {});

function find(table, where) {
  return (0, _getMysqlConnection2.default)().then(runQuery(sql.select(table, prepareWhere(removeEmpty(where) || {})), whereValues(removeEmpty(where) || {}))).then(takeFirst);
}

function update(table, updates, where) {
  console.log(prepareUpdateValues(updates).concat(whereValues(where)));
  return (0, _getMysqlConnection2.default)().then(runQuery(sql.update(table, prepareUpdate(updates), prepareWhere(where)), prepareUpdateValues(updates).concat(whereValues(where)))).then(r => r[0]);
}

function _delete(table, where) {
  if (_config2.default.mysql_soft_delete !== 'true') {
    return (0, _getMysqlConnection2.default)().then(runQuery(sql._delete(table, prepareWhere(where)), whereValues(where)));
  }
  const deleteField = _config2.default.mysql_soft_delete_field;
  const updates = {};
  updates[deleteField] = 1;
  return (0, _getMysqlConnection2.default)().then(runQuery(sql.update(table, prepareUpdate(updates), prepareWhere(where)), prepareUpdateValues(updates).concat(whereValues(where)))).then(r => r[0]);
}

function selectCols(table, fields, where, orderBy, limit = 0) {
  return (0, _getMysqlConnection2.default)().then(runQuery(sql.selectFields(fields, table, prepareWhere(where) + prepareOrder(orderBy) + prepareLimit(limit)), whereValues(where))).then(r => r[0]);
}

function selectFields(table, fields, where, orderBy, limit = 0) {
  return (0, _getMysqlConnection2.default)().then(runQuery(sql.selectFields(fields, table, prepareWhere(where) + prepareOrder(orderBy) + prepareLimit(limit)), whereValues(where))).then(r => r[0]);
}

function select(table, where, orderBy, limit = 0) {
  return (0, _getMysqlConnection2.default)().then(runQuery(sql.select(table, prepareWhere(where) + prepareOrder(orderBy) + prepareLimit(limit)), whereValues(where))).then(r => r[0]);
}

function raw(sqlQuery) {
  return (0, _getMysqlConnection2.default)().then(runQuery(sqlQuery)).then(r => r[0]);
}

function truncate(table) {
  return (0, _getMysqlConnection2.default)().then(runQuery(`TRUNCATE TABLE ${table}`)).then(r => r[0]);
}

function table(table) {
  return {
    delete: where => _delete(table, where),
    find: where => find(table, where),
    select: (where, order = '', limit = 0) => select(table, where, order, limit),
    selectFields: (fields, where, order = '', limit = 0) => selectFields(table, fields, where, order, limit),
    selectCols: (fields, where, order = '', limit = 0) => selectFields(table, fields, where, order, limit),
    update: (updates, where) => update(table, updates, where),
    create: obj => create(table, obj),
    truncate: _ => truncate(table)
  };
}
function now() {
  return createDate();
}
let sharedConn = null;
function sharedConnection(func) {
  return (0, _getMysqlConnection2.default)().then(conn => {
    sharedConn = conn;
    func(() => {
      sharedConn.release();
      sharedConn = null;
    });
  });
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