'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restFacade = require('rest-facade');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _utils = require('./utils');

var _searchEvents = require('./searchEvents');

var _searchEvents2 = _interopRequireDefault(_searchEvents);

var _signupForms = require('./signupForms');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const BASE_URL_FORMAT = 'https://%s';

/**
 * Create a new BSD rest client.
 *
 * @class BSD
 *
 * @constructor
 *  @example <caption>
 *   The <b>BSD</b> constructor takes a API
 *   ID, if specified it will be used as default value for all endpoints that
 *   accept a API ID. The default is 2 but is required
 *   so you are aware of what version you are using.
 *   </caption>
 *
 *  const blueStateDigital = new BSD({
 *   baseUrl: 'legislator.bsd.net',
 *   apiID: 'MyApiID',
 *   apiSecret: '43875utihgkfj38563y4uig',
 *   apiVer: 2,
 * })
 *
 * @param {object}  options The BSD API Options.
 * @param {String}  options.baseUrl The base url of your bsd instance. IE: https://XYZ
 * @param {String}  options.apiID The App ID for your BSD API Secret.
 * @param {String}  options.apiSecret The API Secret for your BSD API App.
 * @param {Number}  options.apiVer The API version, default is 2 and 2 is only supported for now.
 */

class BSD {

  constructor(options) {
    this.apiVer = 2;
    this.searchEvents = _searchEvents2.default;
    this.listForms = _signupForms.listForms;
    this.listFormFields = _signupForms.listFormFields;
    this.getFormByID = _signupForms.getFormByID;

    if (!options) {
      throw new _restFacade.ArgumentError('Must provide a BSD configuration object.');
    }

    if (!options.baseUrl || options.baseUrl.length === 0) {
      throw new _restFacade.ArgumentError('Must provide a base url.');
    }

    if (!options.apiID || typeof options.apiID !== 'string') {
      throw new _restFacade.ArgumentError('Must provide an App ID. ');
    }

    if (!options.apiSecret || typeof options.apiSecret !== 'string') {
      throw new _restFacade.ArgumentError('Must provide an api secret. ');
    }

    if (!options.apiVer || typeof options.apiVer !== 'number') {
      throw new _restFacade.ArgumentError('Must provide an api version number 1 or 2.');
    }

    this.baseUrl = _util2.default.format(BASE_URL_FORMAT, options.baseUrl);
    this.apiID = options.apiID;
    this.apiSecret = options.apiSecret;
    this.apiVer = options.apiVer;
  }

  /**
   *
   *
   * @returns {string} Returns authentication response
   * @memberof BSD
   */
  authenticate() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const timeStamp = Date.now();
      const apiMac = (0, _utils.generateApiMac)({
        path: '/page/api',
        apiID: _this.apiID,
        apiVer: _this.apiVer,
        apiSecret: _this.apiSecret,
        apiTs: timeStamp
      });

      const authResponse = yield (0, _utils.getRequestPromise)({
        url: `${_this.baseUrl}/page/api?api_ver=${_this.apiVer}&api_id=${_this.apiID}&api_ts=${timeStamp}&api_mac=${apiMac}`,
        method: 'GET',
        headers: {
          'User-agent': `node.js/${process.version.replace('v', '')}`,
          'Content-Type': 'application/json'
        }
      });
      return authResponse;
    })();
  }

}

exports.default = BSD;