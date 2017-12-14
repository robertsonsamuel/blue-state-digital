'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateApiMac = exports.getRequestPromise = undefined;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module utils
 */

const getRequestPromise = exports.getRequestPromise = settings => new _bluebird2.default((resolve, reject) => {
  const requestOptions = {
    url: settings.url,
    qs: settings.query,
    method: settings.method,
    body: settings.data,
    json: settings.json,
    headers: settings.headers
  };
  (0, _request2.default)(requestOptions, (err, res, body) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(body);
  });
});
const generateApiMac = exports.generateApiMac = settings => {
  const signingString = `${settings.apiID}\n${settings.apiTs}\n${settings.path}\napi_ver=${settings.apiVer}&api_id=${settings.apiID}&api_ts=${settings.apiTs}${settings.params ? `&${settings.params}` : ''}`;

  return _crypto2.default.createHmac('sha1', settings.apiSecret).update(signingString).digest('hex');
};