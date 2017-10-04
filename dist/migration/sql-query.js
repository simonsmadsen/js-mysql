'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const tableExists = exports.tableExists = table => 'SHOW TABLES LIKE \'' + table + '\'';
const tableFields = exports.tableFields = table => 'SHOW COLUMNS FROM ' + table;