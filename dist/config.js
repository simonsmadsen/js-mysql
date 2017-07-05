'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const env = require('dotenv');
const _config = env.config().parsed;
exports.default = _config;