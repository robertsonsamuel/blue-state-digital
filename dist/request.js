'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  return new _bluebird2.default((resolve, reject) => {
    if (!options) {
      reject(new Error('No request options given'));
    }

    const method = options.method || 'GET';
    const body = options.body,
          query = options.query;

    // api mac must be generated without url encoded parameters

    const qs = _querystring2.default.stringify(query, '&', '=', { encodeURIComponent: str => str });

    const timeStamp = Date.now();
    const apiMac = (0, _utils.generateApiMac)({
      path: options.path,
      apiID: this.apiID,
      apiVer: this.apiVer,
      apiSecret: this.apiSecret,
      apiTs: timeStamp,
      params: qs
    });

    const requestOptions = {
      method,
      url: this.baseUrl + options.path,
      body,
      qs: Object.assign({
        api_ver: this.apiVer,
        api_id: this.apiID,
        api_ts: timeStamp,
        api_mac: apiMac
      }, query || {}),
      headers: {
        'User-agent': `node.js/${process.version.replace('v', '')}`
      }
    };

    (0, _request2.default)(requestOptions, (err, res, respBody) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(respBody);
    });
  });
};

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }