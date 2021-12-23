import util from '@ohos.util';
import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from "deccjsunit/index"
import 'openharmony-polyfill';

export default function TextDecoderPolyfillJsunit() {

  describe('TextDecoderPolyfillJsunit', function () {

    const decoder = new TextDecoder();
    const utilDecoder = new util.TextDecoder();

    it('decode', 0, () => {
      const u8arr = new Uint8Array([240, 160, 174, 183]);
      const i8arr = new Int8Array([-16, -96, -82, -73]);
      const u16arr = new Uint16Array([41200, 47022]);
      const u8Result = decoder.decode(u8arr);
      const i8Result = decoder.decode(i8arr);
      const u16Result = utilDecoder.decode(u16arr);
      expect(u8Result).assertEqual(i8Result)
      expect(u8Result).assertEqual(u16Result);
    })

    it('default-config', 0, () => {
      expect(decoder.encoding).assertEqual('utf-8')
      expect(decoder.fatal).assertEqual(false)
      expect(decoder.ignoreBOM).assertEqual(false)
    })

    it('custom-config', 0, () => {
      const customDecoder = new TextDecoder('windows-1251', {
        fatal: true, ignoreBOM: true
      });
      expect(customDecoder.encoding).assertEqual('windows-1251')
      expect(customDecoder.fatal).assertEqual(true)
      expect(customDecoder.ignoreBOM).assertEqual(true)
    })


  })
}
