import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from "deccjsunit/index"
import 'openharmony-polyfill';

export default function URLSearchParamsPolyfillJsunit() {

  describe('URLSearchParamsPolyfillJsunit', function () {

    const url = new URL('https://example.com?foo=1&bar=2');
    const params = new URLSearchParams(url.search);

    it('append', 0, () => {
      params.append('apple', '3');
      expect(params.toString()).assertEqual('foo=1&bar=2&apple=3')
    })

    it('delete', 0, () => {
      params.delete('foo');
      expect(params.toString()).assertEqual('bar=2&apple=3')
    })

    it('get', 0, () => {
      expect(params.get('bar')).assertEqual('2');
    })

    it('getAll', 0, () => {
      expect(JSON.stringify(params.getAll('bar'))).assertEqual(JSON.stringify(['2']))
    })

    it('has', 0, () => {
      expect(params.has('bar')).assertEqual(true)
    })

    it('set', 0, () => {
      params.set('banana' , '4')
      expect(params.get('banana')).assertEqual('4')
      params.set('banana' , '5')
      expect(params.get('banana')).assertEqual('5')
    })

    it('sort', 0, () => {
      params.sort()
      expect(params.toString()).assertEqual('apple=3&banana=5&bar=2')
    })

  })
}
