import util from '@ohos.util';

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = util.TextEncoder;
}
