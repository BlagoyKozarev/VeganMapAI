'use strict';

const HttpStatus = require('http-status');

/**
 * @class
 */
class verror extends Error {
  /**
   * @param {string} message error message
   * @param {number} [code=500] http error code
   * @param {any} [data] any extra data to attach to the error
   */
  constructor(message, code = HttpStatus.INTERNAL_SERVER_ERROR, data) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, verror);
    }

    this.name = this.constructor.name;
    this.code = code;
    this.data = data;
    this.dateTime = new Date();
  }
}

verror.HTTP_STATUS = HttpStatus;
module.exports = verror;
