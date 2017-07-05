'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connectionPool = undefined;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _extendMysqlConnectionPool = require('./extend-mysql-connection-pool');

var _extendMysqlConnectionPool2 = _interopRequireDefault(_extendMysqlConnectionPool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let mysql = require('mysql2/promise');

const dbConfig = {
    host: _config2.default.mysql_host,
    user: _config2.default.mysql_user,
    password: _config2.default.mysql_password,
    database: _config2.default.mysql_database
};

if (_config2.default.mac) {
    dbConfig.socketPath = '/tmp/mysql.sock';
}

const pool = mysql.createPool(dbConfig);
const connectionPool = exports.connectionPool = pool;