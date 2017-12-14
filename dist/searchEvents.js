'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (params) {
  return new _bluebird2.default((resolve, reject) => {
    const timeStamp = Date.now();
    const queryParams = _querystring2.default.stringify(params);

    const apiMac = (0, _utils.generateApiMac)({
      path: '/page/api/event/search_events',
      params: queryParams.length === 0 ? '' : `${queryParams}`,
      apiID: this.apiID,
      apiVer: this.apiVer,
      apiSecret: this.apiSecret,
      apiTs: timeStamp
    });
    (0, _utils.getRequestPromise)({
      url: `${this.baseUrl}/page/api/event/search_events?api_ver=${this.apiVer}&api_id=${this.apiID}&api_ts=${timeStamp}&api_mac=${apiMac}`,
      method: 'GET',
      query: params,
      json: true,
      headers: {
        'User-agent': `node.js/${process.version.replace('v', '')}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
};

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }