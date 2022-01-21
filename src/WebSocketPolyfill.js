import webSocket from '@ohos.net.webSocket';
import { EventTarget } from './lib/EventTarget';

const BINARY_TYPE = { blob: 'blob', arraybuffer: 'arraybuffer' };
const READY_STATE = { CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 };
const createWS = Symbol('createWS');
const connect = Symbol('connect');
const openHandler = Symbol('openHandler');
const messageHandler = Symbol('messageHandler');
const closeHandler = Symbol('closeHandler');
const errorHandler = Symbol('errorHandler');
const harmonyWS = WebSocket;

/**
 * The WebSocket object provides the API for creating and managing a WebSocket connection to a server,
 * as well as for sending and receiving data on the connection.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
 *
 */
class _WebSocket extends EventTarget {
  #url = '';
  #protocols = [''];
  #binaryType = BINARY_TYPE.blob;
  #bufferedAmount = 0;
  #ws;
  #extensions;
  #protocol;
  #readyState;
  #header = {};

  /**
   *The WebSocket() constructor returns a new WebSocket object.
   * @param {string} url - The URL to which to connect.
   * @param {string[]} protocols - Either a single protocol string or an array of protocol strings.
   */
  constructor(url, protocols) {
    super();
    this.#url = url;

    if (protocols && protocols.length) {
      this.#protocols = protocols;
      this.#protocol = this.#protocols[0];
    }

    this[createWS]();
    this[connect](this.#header);
    this[openHandler]();
    this[messageHandler]();
    this[closeHandler]();
    this[errorHandler]();
  }

  [createWS]() {
    WebSocket = harmonyWS;
    this.#ws = webSocket.createWebSocket();
    WebSocket = _WebSocket;
  }

  [connect](header) {
    this.#readyState = READY_STATE.CONNECTING;
    this.#ws.connect(this.#url, header, (err, value) => {
      if (!err) {
        this.#readyState = READY_STATE.OPEN;
      } else {
        this.#readyState = READY_STATE.CLOSING;
        console.error(value);
      }
    });
  }

  [openHandler]() {
    this.#ws.on('open', (err, value) => {
      if (err) {
        this.#readyState = READY_STATE.CONNECTING;
        console.error(value);
        return;
      }
      this.#readyState = READY_STATE.OPEN;
      if (this.onopen) {
        this.dispatchEvent({ type: 'open' });
        this.onopen({ type: 'open', data: value });
      }
    });
  }

  [messageHandler]() {
    this.#ws.on('message', (err, value) => {
      if (err) {
        this.#readyState = READY_STATE.CONNECTING;
        console.error(value);
        return;
      }
      if (this.onmessage) {
        this.dispatchEvent({ type: 'message' });
        this.onmessage({ type: 'message', data: value });
      }
    });
  }

  [closeHandler]() {
    this.#ws.on('close', (err, value) => {
      if (err) {
        console.error(value);
      }
      this.#readyState = READY_STATE.CLOSED;
      if (this.onclose) {
        this.dispatchEvent({ type: 'close' });
        this.onclose({ type: 'close', data: value });
      }
    });
  }

  [errorHandler]() {
    this.#ws.on('error', (err) => {
      console.error(err);
      if (this.onerror) {
        this.dispatchEvent({ type: 'error' });
        this.error({ type: 'error', data: err });
      }
    });
  }

  close(code, reason) {
    this.#ws.close({ code, reason }, (err, value) => {
      if (err) {
        console.error(`close error:${value}`);
      }
      this.#readyState = READY_STATE.CLOSED;
    });
    return true;
  }

  send(data) {
    this.#ws.send(data, (err, value) => {
      if (err) {
        console.error(`send error:${value}`);
      }
    });
  }

  /**
   * The absolute URL of the WebSocket.
   * @readonly
   * @returns {string}
   */
  get url() {
    return this.#url;
  }

  /**
   * The number of bytes of queued data.
   * @readonly
   * @returns {number}
   */
  get bufferedAmount() {
    return this.#bufferedAmount;
  }

  /**
   * The extensions selected by the server.
   * @readonly
   * @returns {string | string[]}
   */
  get extensions() {
    return this.#extensions;
  }

  /**
   * The sub-protocol selected by the server.
   * @readonly
   * @returns {string}
   */
  get protocol() {
    return this.#protocol;
  }

  /**
   * The current state of the connection.
   * @readonly
   * @returns {number}
   */
  get readyState() {
    return this.#readyState;
  }

  /**
   * The binary data type used by the connection.
   * @returns {string}
   */
  get binaryType() {
    return this.#binaryType;
  }

  set binaryType(type) {
    if (type !== BINARY_TYPE.blob && type !== BINARY_TYPE.arraybuffer) {
      console.error(
        `The value of binaryType can only be ${BINARY_TYPE.blob} or ${BINARY_TYPE.arraybuffer}.`
      );
      return;
    }
    this.#binaryType = type;
  }
}

if (!globalThis.WebSocket) {
  globalThis.WebSocket = _WebSocket;
  WebSocket = _WebSocket;
}
