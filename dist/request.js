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


    const timeStamp = Date.now();
    const apiMac = (0, _utils.generateApiMac)({
      path: options.path,
      apiID: this.apiID,
      apiVer: this.apiVer,
      apiSecret: this.apiSecret,
      apiTs: timeStamp
    });

    const requestOptions = {
      method,
      url: this.baseUrl + options.path,
      body,
      qs: Object.assign(query || {}, {
        api_ver: this.apiVer,
        api_id: this.apiID,
        api_ts: timeStamp,
        api_mac: apiMac
      }),
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

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }