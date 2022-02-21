import http from '@ohos.net.http';
import { parse } from 'json5';
import { StatusMap } from '../lib/statusMap';

const DEFAULT_REFERRER_POLICY = 'strict-origin-when-cross-origin';
function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError(
      'Invalid character in header field name: "' + name + '"'
    );
  }
  return name.toLowerCase();
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }
  return value;
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function () {
      var value = items.shift();
      return { done: value === undefined, value: value };
    }
  };
  iterator[Symbol.iterator] = function () {
    return iterator;
  };
  return iterator;
}

/**
 * The Headers interface of the Fetch API allows you to perform various actions on HTTP request and response headers.
 * These actions include retrieving, setting, adding to, and removing headers from the list of the request's headers.
 */
export class Headers {
  #map = {};

  /**
   * The Headers() constructor creates a new Headers object.
   * @param {*} init
   */
  constructor(init) {
    if (init instanceof Headers) {
      init.forEach((value, name) => {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(init)) {
      init.forEach((header) => {
        this.append(header[0], header[1]);
      }, this);
    } else if (typeof init === 'string') {
      //TODO: the headers returned by OpenHarmony has a null key, we can use JSON.parse() if this bug is fixed.
      const parsed = parse(init);
      if (parsed) {
        Object.getOwnPropertyNames(parsed).forEach(function (name) {
          this.append(name, parsed[name]);
        }, this);
      }
    } else if (init) {
      Object.getOwnPropertyNames(init).forEach(function (name) {
        this.append(name, init[name]);
      }, this);
    }
  }

  /**
   * Appends a new value onto an existing header inside a Headers object, or adds the header if it does not
   * already exist.
   * @param {*} name
   *    The name of the HTTP header you want to add to the Headers object.
   * @param {*} value
   *    The value of the HTTP header you want to add.
   */
  append(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    const oldValue = this.#map[name];
    this.#map[name] = oldValue ? oldValue + ', ' + value : value;
  }

  /**
   * Deletes a header from a Headers object.
   * @param {*} name
   */
  delete(name) {
    delete this.#map[normalizeName(name)];
  }

  /**
   * Returns a String sequence of all the values of a header within a Headers object with a given name
   * @param {*} name
   * @returns
   */
  get(name) {
    name = normalizeName(name);
    return this.has(name) ? this.#map[name] : null;
  }

  /**
   * Returns a boolean stating whether a Headers object contains a certain header.
   * @param {*} name
   * @returns
   */
  has(name) {
    return Object.prototype.hasOwnProperty.call(this.#map, normalizeName(name));
  }

  /**
   * Sets a new value for an existing header inside a Headers object, or adds the header if it does not already exist.
   * @param {*} name
   * @param {*} value
   */
  set(name, value) {
    this.#map[normalizeName(name)] = normalizeValue(value);
  }

  /**
   * Executes a provided function once for each array element.
   * @param {*} callback
   * @param {*} thisArg
   */
  forEach(callback, thisArg) {
    for (let name in this.#map) {
      if (Object.prototype.hasOwnProperty.call(this.#map, name)) {
        callback.call(thisArg, this.#map[name], name, this);
      }
    }
  }

  /**
   * Returns an iterator allowing you to go through all keys of the key/value pairs contained in this object.
   * @returns
   */
  keys() {
    const items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  }

  /**
   * Returns an iterator allowing you to go through all values of the key/value pairs contained in this object.
   * @returns
   */
  values() {
    const items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  }

  /**
   * Returns an iterator allowing to go through all key/value pairs contained in this object.
   * @returns
   */
  entries() {
    const items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  }
}

/**
 * The ReadableStream interface of the Streams API represents a readable stream of byte data. The Fetch
 * API offers a concrete instance of a ReadableStream through the body property of a Response object.
 */
class ReadableStream {
  body;
  constructor(body) {
    this.body = body;
  }

  get locked() {
    return false;
  }

  /**
   * Returns a Promise that resolves when the stream is canceled. Calling this method signals a loss of
   * interest in the stream by a consumer.
   * @returns
   */
  async cancel() {
    return;
  }

  /**
   * Creates a reader and locks the stream to it. While the stream is locked, no other reader can be
   * acquired until this one is released.
   */
  getReader() {
    return new ReadableStreamDefaultReader(this);
  }
}

/**
 * The ReadableStreamDefaultReader interface of the Streams API represents a default reader that can
 * be used to read stream data supplied from a network (e.g. a fetch request).
 */
class ReadableStreamDefaultReader {
  #body;

  constructor(stream) {
    this.#body = stream.body;
  }

  async cancel() {
    return;
  }

  async read() {
    if (typeof this.#body === 'string') {
      const array = new Uint8Array(this.#body.length);
      for (let i = 0; i < this.#body.length; i++) {
        array[i] = this.#body.charCodeAt(i);
      }
      return { value: array, done: true };
    } else {
      return { value: this.#body, done: true };
    }
  }

  releaseLock() {
    return;
  }
}

/**
 * Body class provides common methods for Request and Response
 * @see https://fetch.spec.whatwg.org/#body
 */
 export class Body {
  #body;
  #bodyUsed = false;
  _bodyType;

  constructor(body) {
    if (!body) {
      this.#body = '';
    } else if (typeof body === 'string') {
      this.#body = body;
      this._bodyType = 'text';
    } else if (
      Object.prototype.isPrototypeOf.call(ArrayBuffer, body) ||
      ArrayBuffer.isView(body)
    ) {
      this.#body = this._bufferClone(body);
      this._bodyType = 'blob';
    } else {
      this.#body = JSON.stringify(body);
      this._bodyType = 'text';
    }
  }

  /**
   * A ReadableStream of the body contents.
   */
  get body() {
    return new ReadableStream(this.#body);
  }

  get _body() {
    return this.#body;
  }

  /**
   * Stores true or false to indicate whether or not the body has been used in a request yet.
   */
  get bodyUsed() {
    return this.#bodyUsed;
  }

  /**
   * Returns a promise that resolves with a text representation of the request body.
   * @returns Promise
   */
  async text() {
    this._consumeBody();
    if (this._bodyType === 'blob') {
      const view = new Uint8Array(this.#body);
      let chars = new Array(view.length);
      for (var i = 0; i < view.length; i++) {
        chars[i] = String.fromCharCode(view[i]);
      }
      return chars.join('');
    } else {
      return this.#body;
    }
  }

  /**
   * Returns a promise that resolves with the result of parsing the request body as JSON.
   * @returns Promise
   */
  async json() {
    const text = await this.text();
    return JSON.parse(text);
  }

  /**
   * Returns a promise that resolves with an ArrayBuffer representation of the response body.
   * @returns Promise
   */
  async arrayBuffer() {
    this._consumeBody();
    if (this._bodyType === 'blob') {
      if (ArrayBuffer.isView(this.#body)) {
        const { buffer, byteOffset, byteLength } = this.#body;
        return buffer.slice(byteOffset, byteOffset + byteLength);
      } else {
        return this.#body;
      }
    }
  }

  /**
   * Returns a promise that resolves with a Blob representation of the response body.
   * @returns Promise
   */
  async blob() {
    return this.#body;
  }

  _consumeBody() {
    if (this.#bodyUsed) {
      throw new TypeError('Body already used!');
    }
    this.#bodyUsed = true;
  }

  _bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }
}

/**
 * The Request interface of the Fetch API represents a resource request.
 */
 export class Request extends Body {
  cache = 'default';

  #url;
  #credentials;
  #headers;
  #method;
  #mode;
  #signal;
  #referrer;

  /**
   * Creates a new Request object.
   * @param {*} input
   *    Defines the resource that you wish to fetch.
   * @param {*} init
   *    An options object containing any custom settings that you want to apply to the request.
   */
  constructor(input, init = {}) {
    let method = init.method || input.method || 'GET';
    method = method.toUpperCase();
    const inputBody = init.body
      ? init.body
      : input instanceof Request
        ? input._body
        : null;
    if ((method === 'GET' || method === 'HEAD') && inputBody) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    super(inputBody);

    this.#url = input instanceof Request ? input.url : String(input);
    this.#credentials = init.credentials || input.credentials || 'same-origin';
    this.#headers = new Headers(init.headers || input.headers || {});
    this.#method = method;
    this.#mode = init.mode || input.mode;
    this.#signal = init.signal || input.signal;
    this.#referrer = init.referrer || input.referrer;
    if (this.#method === 'GET' || this.#method === 'HEAD') {
      if (init.cache === 'no-store' || init.cache === 'no-cache') {
        // Search for a '_' parameter in the query string
        const reParamSearch = /([?&])_=[^&]*/;
        if (reParamSearch.test(this.url)) {
          // If it already exists then set the value with the current time
          this.#url = this.#url.replace(
            reParamSearch,
            '$1_=' + new Date().getTime()
          );
        } else {
          // Otherwise add a new '_' parameter to the end with the current time
          const reQueryString = /\?/;
          this.#url +=
            (reQueryString.test(this.#url) ? '&' : '?') +
            '_=' +
            new Date().getTime();
        }
      }
    }
  }

  /**
   * Contains the URL of the request.
   */
  get url() {
    return this.#url;
  }

  /**
   * Contains the credentials of the request (e.g., omit, same-origin, include). The default is same-origin.
   */
  get credentials() {
    return this.#credentials;
  }

  /**
   * Contains the associated Headers object of the request.
   */
  get headers() {
    return this.#headers;
  }

  /**
   * Contains the request's method (GET, POST, etc.)
   */
  get method() {
    return this.#method;
  }

  /**
   * Contains the mode of the request (e.g., cors, no-cors, same-origin, navigate.)
   */
  get mode() {
    return this.#mode;
  }

  get signal() {
    return this.#signal;
  }

  /**
   * Contains the referrer of the request (e.g., client).
   */
  get referrer() {
    return this.#referrer;
  }

  /**
   * Creates a copy of the current Request object.
   * @returns
   */
  clone() {
    return new Request(this, { body: this._bodyInit });
  }
}

/**
 * The Response interface of the Fetch API represents the response to a request.
 */
 export class Response extends Body {
  #type;
  #status;
  #ok;
  #headers;
  #url;

  constructor(body, init) {
    super(body);
    if (!init) {
      init = {};
    }

    this.#type = 'default';
    this.#status = init.status === undefined ? 200 : init.status;
    this.#ok = this.#status >= 200 && this.#status < 300;
    this.#headers = new Headers(init.headers);
    this.#url = init.url || '';
  }

  /**
   * The Headers object associated with the response.
   */
  get headers() {
    return this.#headers;
  }

  /**
   * A boolean indicating whether the response was successful (status in the range 200–299) or not.
   */
  get ok() {
    return this.#ok;
  }
  /**
   * The status code of the response. (This will be 200 for a success).
   */
  get status() {
    return this.#status;
  }

  /**
   * The status message corresponding to the status code. (e.g., OK for 200).
   */
  get statusText() {
    return StatusMap[this.#status];
  }

  /**
   * The type of the response (e.g., basic, cors).
   */
  get type() {
    return this.#type;
  }

  /**
   * Contains the URL of the request.
   */
  get url() {
    return this.#url;
  }

  /**
   * Creates a clone of a Response object.
   * @returns
   */
  clone() {
    return new Response(this._bodyInit, {
      status: this.status,
      headers: new Headers(this.headers),
      url: this.url
    });
  }

  /**
   * Returns a new Response object associated with a network error.
   * @returns
   */
  error() {
    const response = new Response(null, { status: 0 });
    response.#type = 'error';
    return response;
  }

  /**
   * Creates a new response with a different URL.
   * @param {*} url
   * @param {*} status
   * @returns
   */
  redirect(url, status) {
    const redirectStatuses = [301, 302, 303, 307, 308];
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  }
}

class FetchError extends Error {
  constructor(message, name) {
    super(message);
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  }
}

/**
 * Convert a Request to Openharmony http request options.
 * @param  {Request} request - A Request instance
 * @returns The options object to be passed to http.request
 */
function getHarmonyRequestOptions(request) {
  const headers = {};

  if (request._body && request._bodyType === 'blob') {
    const totalBytes = request._body.length;
    headers['Content-Length'] = String(totalBytes);
  }

  if (request.referrerPolicy === '') {
    request.referrerPolicy = DEFAULT_REFERRER_POLICY;
  }
  if (request.referrer && request.referrer instanceof URL) {
    headers['Referer'] = request.referrer;
  }
  if (!request.headers.has('User-Agent')) {
    headers['User-Agent'] = 'openharmony-fetch';
  }
  if (request.compress && !request.headers.has('Accept-Encoding')) {
    headers['Accept-Encoding'] = 'gzip,deflate,br';
  }

  request.headers.forEach((value, name) => {
    headers[name] = value;
  });

  return {
    method: request.method,
    header: headers,
    extraData: request._body
  };
}

/**
 * The global fetch() method starts the process of fetching a resource from the network, returning a promise which is
 * fulfilled once the response is available.
 * @param {*} resource
 *    This defines the resource that you wish to fetch. This can either be a string or a Request object.
 * @param {*} init
 *    An object containing any custom settings that you want to apply to the request.
 * @returns
 */
export function fetch(resource, init) {
  return new Promise(function (resolve, reject) {
    const request = new Request(resource, init);
    if (request.signal && request.signal.aborted) {
      return reject(new FetchError('Aborted', 'AbortError'));
    }

    const httpRequest = http.createHttp();
    const options = getHarmonyRequestOptions(request);
    httpRequest.request(request.url, options, (err, data) => {
      if (err) {
        reject(new TypeError('Network request failed'));
        return;
      } else {
        const body = data.result;
        const responseOpttions = {
          url: request.url,
          status: data.responseCode,
          headers: data.header
        };
        resolve(new Response(body, responseOpttions));
      }
    });
  });
}
