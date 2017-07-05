'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLink;

var _getMysqlConnection = require('./../database/get-mysql-connection');

var _getMysqlConnection2 = _interopRequireDefault(_getMysqlConnection);

var _sqlQueryStr = require('./sql-query-str');

var sql = _interopRequireWildcard(_sqlQueryStr);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = (d, n) => {
  console.log([n, d]);
  return d;
};

const quote = str => '\'' + str + '\'';
const formatDate = date => date.toISOString().slice(0, 19).replace('T', ' ');
const createDate = _ => formatDate(new Date());

const defaultValues = {
  created_at: createDate(),
  updated_at: createDate(),
  deleted: false
};

const quoteIfStrOrDate = str => typeof str == 'string' ? quote(str) : typeof str == 'object' ? quote(formatDate(str)) : str;

const sqlFields = obj => Object.keys(obj).join();
const sqlValues = obj => Object.values(obj).map(quoteIfStrOrDate).join();

const objectToCreateQuery = (table, obj) => sql.insert(table, sqlFields(obj), sqlValues(obj));

const create = url => Object.assign(defaultValues, { url: url });

const queryCreate = url => conn => conn.query(objectToCreateQuery('links', create(url)));

function createLink(url) {
  (0, _getMysqlConnection2.default)().then(queryCreate(url)).then(console.log).catch(console.log);
}