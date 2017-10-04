'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const env = require('dotenv');
let config = env.config().parsed;

if (!config) {
  config = env.config({ path: __dirname + '/../' + '.env_template' }).parsed;
}
exports.default = config;