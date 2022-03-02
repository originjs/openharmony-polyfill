/**
 * polyfill for URL
 */
import { URL, URLSearchParams } from './url';
if (URL && !globalThis.URL) {
  globalThis.URL = URL;
}
if (URLSearchParams && !globalThis.URLSearchParams) {
  globalThis.URLSearchParams = URLSearchParams;
}
/**
 * polyfill for Encoding
 */
import { TextDecoder, TextEncoder } from './encoding';
if (TextDecoder && !globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}
if (TextEncoder && !globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}
/**
 * polyfill for XMLHttpRequest
 */
import { XMLHttpRequest } from './xhr';
if (!globalThis.XMLHttpRequest) {
  globalThis.XMLHttpRequest = XMLHttpRequest;
}

/**
 * polyfill for fetch
 */
import { fetch as _fetch, Headers, Request, Response } from './fetch';
_fetch.polyfill = true;
if (!globalThis.fetch) {
  globalThis.fetch = _fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
  // We have a `fetch` object in `script` scope, replace it
  if (!globalThis.original) {
    globalThis.original = {};
  }
  globalThis.original.fetch = fetch;
  fetch = _fetch;
}

/**
 * polyfill for Crypto
 */
import { crypto } from './crypto';
if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

/**
 * polyfill for WebSocket
 */
import { WebSocket as _WebSocket } from './websocket';
if (!globalThis.WebSocket) {
  globalThis.WebSocket = _WebSocket;
  WebSocket = _WebSocket;
}

/**
 * polyfill for Canvas
 */
import { HmCanvas } from './canvas';
globalThis.HmCanvas = HmCanvas;

/**
 * polyfill for Storage
 */
import { LocalStorage } from './storage';
LocalStorage.init();
globalThis.localStorage = globalThis.localStorage ?? LocalStorage;

/**
 * polyfill for Navigator
 */
import { navigator } from './navigator';
if (!globalThis.navigator) {
  globalThis.navigator = navigator;
}
