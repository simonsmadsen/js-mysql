'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const env = require('dotenv');
let _config = env.config().parsed;

if (!_config) {
  _config = env.config({ path: __dirname + '/../' + '.env_template' }).parsed;
}

exports.default = _config;