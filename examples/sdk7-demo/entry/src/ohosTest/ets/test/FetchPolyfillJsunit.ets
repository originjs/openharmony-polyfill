import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from "deccjsunit/index"
import 'openharmony-polyfill';

export default function FetchPolyfillJsunit() {
  describe('fetchPolyfillTest', function () {
    it('fetch_normal', 0, async function () {
      const response = await fetch('https://gitee.com/');
      const status = await response.status
      expect(status).assertEqual(200)
    });

    it('fetch_json', 0, async function () {
      const response = await fetch('https://gitee.com/api/v5/search/users');
      const data = await response.json();
      expect(JSON.stringify(data)).assertEqual('{"messages":["q is missing","q is empty"]}')
    });

    it('fetch_with_option', 0, async function () {
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: 'a=1'
      });
      const data = await response.json();
      expect(JSON.stringify(data.form)).assertEqual('{"a":"1"}')
    });

    it('fetch_handle_error', 0, async function () {
      try {
        await fetch('https://localhos/test.txt');
      } catch (error) {
        expect(error.message).assertEqual("Network request failed")
      }
    });
  });
}
