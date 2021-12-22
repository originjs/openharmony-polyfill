import util from '@ohos.util';

/**
 * since: API 7
 */
if (util?.TextEncoder && !globalThis.TextEncoder) {
  globalThis.TextEncoder = util.TextEncoder;
}
