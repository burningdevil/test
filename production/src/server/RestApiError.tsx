export class RestApiError extends Error {
    public name = "RestApiError";
    public message = ""
    public stack = ""

    public statusCode: number
    public statusMsg: number
    public errorCode: number
    public iServerErrorCode: number
    public errorMsg = ""
    public ticketId = ""
    constructor(statusCode: number, errorCode: number, errorMsg: string, iServerErrorCode?: number, statusMsg?: number, ticketId?: string) {
        super()
        // Assign each of the individual fields
        this.statusCode = statusCode;
        this.statusMsg = statusMsg;
        this.errorCode = errorCode;
        this.iServerErrorCode = iServerErrorCode;
        this.errorMsg = errorMsg;
        this.ticketId = ticketId;
    
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

    fromError(error: any) {
        // Extract fields out of the error...
        const statusCode = 0,
            errorCode = 0,
            errorMsg = error.message || '';
    
        return new RestApiError(statusCode, errorCode, errorMsg, null, null, null);
    }

    fromXhr = (jqXHR: any) => {
        // Extract fields out of the XHR...
        const statusCode = jqXHR.status,
            responseJson = jqXHR.responseText && JSON.parse(jqXHR.responseText) || {},
            errorCode = responseJson.code || 0,
            errorMsg = responseJson.message || '',
            iServerErrorCode = responseJson.iServerCode || 0,
            ticketId = responseJson.ticketId;
    
        return new RestApiError(statusCode, errorCode, errorMsg, iServerErrorCode, jqXHR.statusText, ticketId);
    };
}