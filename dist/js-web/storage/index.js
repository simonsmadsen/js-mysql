'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mysql = undefined;

var _mysql2 = require('./mysql');

var _mysql = _interopRequireWildcard(_mysql2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const mysql = exports.mysql = _mysql;