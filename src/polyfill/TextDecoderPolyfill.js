import util from '@ohos.util';

/**
 * since: API 7
 */
if (util?.TextDecoder && !globalThis.TextDecoder) {
  globalThis.TextDecoder = util.TextDecoder;
}
