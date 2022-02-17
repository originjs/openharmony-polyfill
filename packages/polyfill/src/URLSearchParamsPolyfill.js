import url from '@ohos.url';

/**
 * since: API 7
 */
if (url?.URLSearchParams && !globalThis.URLSearchParams) {
  globalThis.URLSearchParams = url.URLSearchParams;
}
