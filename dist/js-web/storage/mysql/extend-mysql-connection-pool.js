"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extendPool;
function extendPool(pool) {
  pool.newConnection = function () {
    return new Promise(function (resolve, reject) {
      resolve({});
      return;
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err);
        }
        resolve(connection);
      });
    });
  };
  pool.newConnection = pool.newConnection.bind(pool);
  return pool;
}