import http from '@ohos.net.http';
import { parse } from 'json5';
import { EventTarget } from '../lib/eventTarget';
import { StatusMap } from '../lib/statusMap';

/**
 * The ProgressEvent interface represents events measuring progress of an underlying process, like an HTTP request
 * (for an XMLHttpRequest, or the loading of the underlying resource of an <img>, <audio>, <video>, <style> or <link>).
 */
class ProgressEvent {
  #type;
  #lengthComputable;
  #loaded;
  #total;

  /**
   * Creates a ProgressEvent event with the given parameters.
   * @param {*} type
   * @param {*} lengthComputable
   * @param {*} loaded
   * @param {*} total
   */
  constructor(type, lengthComputable, loaded, total) {
    this.#type = type;
    this.#lengthComputable = lengthComputable;
    this.#loaded = loaded;
    this.#total = total;
  }

  /**
   * The case-insensitive name indentifying the type of the event.
   */
  get type() {
    return this.#type;
  }

  /**
   * A boolean flag indicating if the total work to be done, and the amount of work already done, by the
   * underlying process is calculable. In other words, it tells if the progress is measurable or not.
   */
  get lengthComputable() {
    return this.#lengthComputable;
  }

  /**
   * A 64-bit unsigned integer value indicating the amount of work already performed by the underlying process.
   */
  get loaded() {
    return this.#loaded;
  }

  /**
   * A 64-bit unsigned integer representing the total amount of work that the underlying process is in the progress of performing.
   */
  get total() {
    return this.#total;
  }
}

/**
 * XMLHttpRequest (XHR) objects are used to interact with servers. You can retrieve data from a URL
 * without having to do a full page refresh. This enables a Web page to update just part of a page
 * without disrupting what the user is doing.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 */
export class XMLHttpRequest extends EventTarget {
  static get UNSENT() {
    return 0;
  }
  static get OPENED() {
    return 1;
  }
  static get HEADERS_RECEIVED() {
    return 2;
  }
  static get LOADING() {
    return 3;
  }
  static get DONE() {
    return 4;
  }

  #httpRequest;
  #url;
  #options;
  #overrideMimeType;
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
    this.#readyState = XMLHttpRequest.UNSENT;
    this.#status = XMLHttpRequest.UNSENT;
    this.#options = {};
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
    if (this.responseType === 'arraybuffer') {
      if (typeof this.#response === 'function') {
        return this.#response;
      }

      const length = this.#responseText.length;
      const array = new Int8Array(length);
      for (let i = 0; i < length; i++) {
        array[i] = this.#responseText.charCodeAt(i);
      }
      return array.buffer;
    } else if (this.responseType === 'json') {
      return JSON.parse(this.#responseText);
    }
    return this.#responseText;
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
    return StatusMap[this.#status];
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
        this._changeReadyState(XMLHttpRequest.HEADERS_RECEIVED);
        //TODO: the headers returned by OpenHarmony has a null key, we can use JSON.parse() if this bug is fixed.
        const parsed = parse(data.header);
        this.#responseHeaders = {};
        if (parse) {
          Object.getOwnPropertyNames(parsed).forEach(function (name) {
            let value = parsed[name];
            if (typeof value !== 'string') {
              value = String(value);
            }
            this.#responseHeaders[name.toLowerCase()] = value;
          }, this);
        }
        // overrides the MIME type returned by the server.
        if (this.#overrideMimeType) {
          this.#responseHeaders['content-type'] = this.#overrideMimeType;
        }
      }
    });

    this._changeReadyState(XMLHttpRequest.OPENED);
  }

  /**
   * Overrides the MIME type returned by the server.
   * @param {*} mimeType
   *    A DOMString specifying the MIME type to use instead of the one specified by the server.
   */
  overrideMimeType(mimeType) {
    this.#overrideMimeType = mimeType;
  }

  /**
   * Sends the request. If the request is asynchronous (which is the default), this method returns as soon as the request is sent.
   * @param {*} body
   */
  send(body) {
    this.#options.extraData = body;
    if (this.timeout) {
      const timeout = Number(this.timeout);
      this.#options.readTimeout = timeout;
      this.#options.connectTimeout = timeout;
    }
    this.#httpRequest.request(this.#url, this.#options, (err, data) => {
      let loaded = 0;
      if (!err) {
        this.#status = data.responseCode;
        // openharmony now only returns string, arraybuffer will be supported later.
        if (typeof data.result === 'string') {
          this.#responseText = data.result;
        } else {
          this.#response = data.result;
        }

        this.dispatchEvent({ type: 'load' });
        // https://xhr.spec.whatwg.org/#progressevent
        if (this.onload) {
          this.onload(new ProgressEvent('load', false, loaded));
        }
      } else {
        this.dispatchEvent({ type: 'error' });
        if (this.onerror) {
          this.onerror(new ProgressEvent('error', false, loaded));
          console.error(err.data);
        }
      }

      this._changeReadyState(XMLHttpRequest.DONE);
      this.dispatchEvent({ type: 'loadend' });
      this.onloadend(new ProgressEvent('loadend', false, loaded));
    });
  }

  /**
   * Aborts the request if it has already been sent.
   */
  abort() {
    if (this.#httpRequest) {
      this.#httpRequest.destroy();
    }
    this._changeReadyState(XMLHttpRequest.UNSENT);
    this.#status = XMLHttpRequest.UNSENT;
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
    if (!this.#responseHeaders) {
      return null;
    }
    const array = [];
    Object.getOwnPropertyNames(this.#responseHeaders).forEach(function (name) {
      array.push(name + ': ' + this.#responseHeaders[name] + '\r\n');
    }, this);
    return array.join('');
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

  // axios will check if onloadend exists, so we define an empty function
  onloadend(e) { }

  _changeReadyState(state) {
    this.#readyState = state;
    if (this.onreadystatechange) {
      this.onreadystatechange();
    }
  }
}
