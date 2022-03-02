// mount polyfill objects to globalThis
import './web/index.js';
import './node/index.js';

// export classes & functions to avoid TS2304 errors
export { URL, URLSearchParams } from './web/url';
export { TextDecoder, TextEncoder } from './web/encoding';
export { XMLHttpRequest } from './web/xhr';
export { fetch, Headers, Request, Response } from './web/fetch';
export { crypto } from './web/crypto';
export { WebSocket } from './web/websocket';
export { LocalStorage } from './web/storage';
export { navigator } from './web/navigator';
