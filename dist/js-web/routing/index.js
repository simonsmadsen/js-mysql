'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.route = route;
exports.postRoute = postRoute;
exports.start = start;

var _config = require('./../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type,who,handshake-public,secret,app');
  next();
};
app.use(allowCrossDomain);

const serverConfig = _config2.default.mac ? {} : {
  key: fs.readFileSync('/etc/letsencrypt/live/links.madsensolutions.dk/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/links.madsensolutions.dk/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/links.madsensolutions.dk/fullchain.pem')
};

const getUserImputs = req => {
  const first = Object.assign({}, req.body, req.params);
  return Object.assign({}, first, req.query);
};

const sendJsonResult = res => r => res.json(r);
const sendError = res => e => {
  res.send(500);
  console.log(['err in route', route, e]);
};

const handlePromiseResult = (promise, res) => promise.then(sendJsonResult(res)).catch(sendError(res));

function route(route, func) {
  app.get(route, (req, res) => {
    const result = func(getUserImputs(req));
    result instanceof Promise ? handlePromiseResult(result, res) : res.json(result);
  });
}

function postRoute(route, func) {
  app.post(route, (req, res) => {
    const result = func(getUserImputs(req));
    result instanceof Promise ? handlePromiseResult(result, res) : res.json(result);
  });
}

function start() {
  const server = _config2.default.mac ? require('http').createServer(app).listen(_config2.default.port) : require('https').createServer(serverConfig, app).listen(_config2.default.port);
}