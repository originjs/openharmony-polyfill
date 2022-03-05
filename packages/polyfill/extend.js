import './index.js';

/**
 * polyfill for WebSocket
 */
import { WebSocket as _WebSocket } from './web/websocket';
if (!globalThis.WebSocket) {
  globalThis.WebSocket = _WebSocket;
  WebSocket = _WebSocket;
}

export { WebSocket } from './web/websocket';
