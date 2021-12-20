import util from '@ohos.util';

if (util && !globalThis.TextEncoder) {
  globalThis.TextEncoder = util.TextEncoder;
}
