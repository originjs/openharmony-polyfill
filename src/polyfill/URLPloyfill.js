import url from '@ohos.url'

/**
 * since: API 7
 */
if (url?.URL && !globalThis.URL) {
  globalThis.URL = url.URL;
}
