import util from '@ohos.util';
import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from "deccjsunit/index"
import 'openharmony-polyfill';

export default function TextEncoderPolyfillJsunit() {


  describe('TextEncoderPolyfillJsunit', function () {

    const encoder = new TextEncoder();
    const utilEncoder = new util.TextEncoder();
    it('encode', 0, () => {
      const encoderResult = encoder.encode('€');
      const utilResult = utilEncoder.encode('€');
      expect(JSON.stringify(encoderResult)).assertEqual(JSON.stringify(utilResult))
    })
    it('encodeInto', 0, () => {
      const arr1 = new Uint8Array(2);
      const arr2 = new Uint8Array(2);
      encoder.encodeInto('11', arr1);
      utilEncoder.encodeInto('11', arr2);
      expect(JSON.stringify(arr1)).assertEqual(JSON.stringify(arr2))
    })
  })
}
