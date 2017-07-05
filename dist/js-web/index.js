'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storage = undefined;

var _routing = require('./routing');

Object.keys(_routing).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _routing[key];
    }
  });
});

var _storage2 = require('./storage');

var _storage = _interopRequireWildcard(_storage2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const storage = exports.storage = _storage;