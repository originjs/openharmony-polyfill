import http from '@ohos.net.http';
import { EventTarget } from '../super-class/EventTarget';

const StatusCode = {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4,
}
/**
 * XMLHttpRequest (XHR) objects are used to interact with servers. You can retrieve data from a URL
 * without having to do a full page refresh. This enables a Web page to update just part of a page
 * without disrupting what the user is doing.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 */
class XMLHttpRequest extends EventTarget {
    #httpRequest;
    #url;
    #options;
    #responseHeaders;
    #readyState;
    #response;
    #responseText;
    #status;

    /**
     * The constructor initializes an XMLHttpRequest. It must be called before any other method calls.
     */
    constructor() {
        super();
        this.#readyState = StatusCode.UNSENT;
        this.#status = StatusCode.UNSENT;
        this.#options = {}
    }

    /**
     * Returns an unsigned short, the state of the request.
     */
    get readyState() {
        return this.#readyState;
    }

    /**
     * Returns an ArrayBuffer, Blob, Document, JavaScript object, or a DOMString, depending on the
     * value of XMLHttpRequest.responseType, that contains the response entity body.
     */
    get response() {
        return this.#response;
    }

    /**
     * Returns a DOMString that contains the response to the request as text, or null if the
     * request was unsuccessful or has not yet been sent.
     */
    get responseText() {
        return this.#responseText;
    }

    /**
     * Is an enumerated value that defines the response type.
     */
    responseType = null;

    /**
     * Returns an unsigned short with the status of the response of the request.
     */
    get status() {
        return this.#status;
    }

    /**
     * Returns a DOMString containing the response string returned by the HTTP server.
     * Unlike XMLHttpRequest.status, this includes the entire text of the response message
     * ("200 OK", for example).
     */
    get statusText() {
        return '' + this.#status;
    }

    /**
     * Is an unsigned long representing the number of milliseconds a request can take before automatically being terminated.
     */
    timeout = null;

    /**
     * Initializes a request.
     * @param {*} method
     *      The HTTP request method to use, such as "GET", "POST", "PUT", "DELETE", etc. Ignored for non-HTTP(S) URLs.
     * @param {*} url
     *      A DOMString representing the URL to send the request to.
     * @param {*} async
     *      If this value is false, the send() method does not return until the response is received.
     *      If true, notification of a completed transaction is provided using event listeners.
     * @param {*} user
     *      The optional user name to use for authentication purposes; by default, this is the null value.
     * @param {*} password
     *      The optional password to use for authentication purposes; by default, this is the null value.
     * @deprecated https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#access_using_credentials_in_the_url
     */
    open(method, url, async, user, password) {
        if (async === false) {
            throw 'only asynchronous behavior is supported';
        }
        this.#options.method = method;
        this.#url = url;
        this.#httpRequest = http.createHttp();
        this.#httpRequest.on('headerReceive', (err, data) => {
            if (!err) {
                this.#readyState = StatusCode.HEADERS_RECEIVED;
                //TODO incalid json
                this.#responseHeaders = JSON.parse(data.header);
            }
        });
        this.#readyState = StatusCode.OPENED;
    }

    /**
     * Sends the request. If the request is asynchronous (which is the default), this method returns as soon as the request is sent.
     * @param {*} body
     */
    send(body) {
        this.#options.extraData = body;
        if (this.timeout) {
            this.#options.readTimeout = this.timeout;
            this.#options.connectTimeout = this.timeout;
        }
        this.#httpRequest.request(this.#url, this.#options, (err, data) => {
            let loaded = 0;
            if (!err) {
                this.#status = data.responseCode;
                this.#response = data.result;
                this.#responseText = data.result;
                this.dispatchEvent({ type: 'load' });
                //TODO https://xhr.spec.whatwg.org/#progressevent
                if (this.onload) {
                    this.onload({ type: 'load', loaded });
                }
            } else {
                this.dispatchEvent({ type: 'error' });
                if (this.onerror) {
                    this.onerror({ type: 'error', loaded });
                    console.error(err.data);
                }
            }

            this.#readyState = StatusCode.DONE;
            this.dispatchEvent({ type: 'loadend' });
            this.onloadend({ type: 'loadend', loaded });
        });
    }

    /**
     * Aborts the request if it has already been sent.
     */
    abort() {
        if (this.#httpRequest) {
            this.#httpRequest.destroy();
        }
        this.#readyState = StatusCode.UNSENT;
        this.#status = StatusCode.UNSENT;
    }

    /**
     * Sets the value of an HTTP request header. You must call setRequestHeader()after open(), but before send().
     * @param {*} name
     * @param {*} value
     */
    setRequestHeader(name, value) {
        name = name.toLowerCase();
        if (!this.#options.header) {
            this.#options.header = {};
        }
        this.#options.header[name] = value;
    }

    /**
     * Returns all the response headers, separated by CRLF, as a string, or null if no response has been received.
     */
    getAllResponseHeaders() {
        return this.#responseHeaders;
    }

    /**
     * Returns the string containing the text of the specified header, or null if either the response has not yet been
     * received or the header doesn't exist in the response.
     * @param {*} name
     */
    getResponseHeader(name) {
        name = name.toLowerCase();
        if (!(name in this.#responseHeaders)) {
            return undefined;
        }
        return this.#responseHeaders[name];
    }

    onloadend(e) { }
}

if (!globalThis.XMLHttpRequest) {
    globalThis.XMLHttpRequest = XMLHttpRequest;
    globalThis.navigator = {
        product: 'NS'
    }
}
