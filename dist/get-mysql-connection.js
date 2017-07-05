'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getConnection;

var _getMysqlPool = require('./get-mysql-pool');

var pool = _interopRequireWildcard(_getMysqlPool);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getConnection(connectionPool) {
  return pool.connectionPool.getConnection();
}