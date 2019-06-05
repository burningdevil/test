import RestApiErrorKeys from './RestApiErrorKeys'

/**
 * An object that is returned in a failed Promise. It contains information relevant to the caller
 * about why the Promise failed. It is a subclass of Error and has properties like stack and message.
 * @typedef RestApiError
 * @type {Error}
 * @property {number} statusCode The HTTP Status code.
 * @property {string} statusMsg The HTTP Status message.
 * @property {number} errorCode The IServer error code key.
 * @property {number} iServerErrorCode The IServer error code.
 * @property {string} errorMsg The IServer error message.
 */

// Constructor function
function RestApiError(statusCode, errorCode, errorMsg, iServerErrorCode, statusMsg, ticketId) {
    // Assign each of the individual fields
    this[RestApiErrorKeys.STATUS_CODE_KEY] = statusCode;
    this[RestApiErrorKeys.STATUS_MSG_KEY] = statusMsg;
    this[RestApiErrorKeys.ERROR_CODE_KEY] = errorCode;
    this[RestApiErrorKeys.ISERVER_ERROR_CODE] = iServerErrorCode;
    this[RestApiErrorKeys.ERROR_MESSAGE_KEY] = errorMsg;
    this[RestApiErrorKeys.TICKET_ID] = ticketId;

    let stack = new Error().stack;
    // IE11 does not initialize 'Error.stack' until the object is thrown.
    if (!stack) {
        try {
            throw new Error();
        } catch (e) {
            stack = e.stack;
        }
    }
    // Construct the call stack...
    this.stack = `${this.name} at ${stack}`;
}

// "Wire up" this new class with its base class
RestApiError.prototype = Object.create(Error.prototype);
RestApiError.prototype.name = 'RestApiError';
RestApiError.prototype.message = '';
RestApiError.prototype.constructor = RestApiError;

/**
 * Returns an error object which contains the error message and error code from a JavaScript exception object.
 * @param  {Error} error A JavaScript Error object.
 * @return {RestApiError} An object contains three properties.
 */
RestApiError.fromError = (error) => {
    // Extract fields out of the error...
    const statusCode = 0,
        errorCode = 0,
        errorMsg = error.message || '';

    return new RestApiError(statusCode, errorCode, errorMsg);
};

/**
 * Returns an error object which contains the error message and error code from the jQuery XHR object.
 * @param  {jqXHR} jqXHR The jquery XMLHttpRequest (jqXHR) object returned by $.ajax().
 * @return {RestApiError} An Error object contains several fields.
 */
RestApiError.fromXhr = (jqXHR) => {
    // Extract fields out of the XHR...
    const statusCode = jqXHR.status,
        responseJson = jqXHR.responseText && JSON.parse(jqXHR.responseText) || {},
        errorCode = responseJson.code || 0,
        errorMsg = responseJson.message || '',
        iServerErrorCode = responseJson.iServerCode || 0,
        ticketId = responseJson.ticketId;

    return new RestApiError(statusCode, errorCode, errorMsg, iServerErrorCode, jqXHR.statusText, ticketId);
};

export default RestApiError
