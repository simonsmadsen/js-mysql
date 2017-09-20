'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectionPool = undefined;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mysql = require('mysql2/promise');

const dbConfig = {
  host: _config2.default.mysql_host,
  user: _config2.default.mysql_user,
  password: _config2.default.mysql_password,
  database: _config2.default.mysql_database,
  port: _config2.default.mysql_port ? _config2.default.mysql_port : 3306
};

if (_config2.default.mac === 'true') {
  dbConfig.socketPath = '/tmp/mysql.sock';
}

const pool = mysql.createPool(dbConfig);
const connectionPool = exports.connectionPool = pool;