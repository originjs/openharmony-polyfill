import util from '@ohos.util';
import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from "deccjsunit/index"
import 'openharmony-polyfill';

export default function URLPolyfillJsunit() {

  describe('URLPolyfillJsunit', function () {

    // @ts-ignore
    const url = new URL('/abc?x=1#1', 'https://abc.com:1234')
    it('hash', 0, () => {
      expect(url.hash).assertEqual('#1')
    })

    it('host', 0, () => {
      expect(url.host).assertEqual('abc.com:1234')
    })

    it('hostname', 0, () => {
      expect(url.hostname).assertEqual('abc.com')
    })

    it('href', 0, () => {
      expect(url.href).assertEqual('https://abc.com:1234/abc#1')
    })

    it('origin', 0, () => {
      expect(url.origin).assertEqual('https://abc.com:1234')
    })

    it('password', 0, () => {
      expect(url.password).assertEqual('')
    })

    it('pathname', 0, () => {
      expect(url.pathname).assertEqual('/abc')
    })

    it('port', 0, () => {
      expect(url.port).assertEqual('1234')
    })

    it('protocol', 0, () => {
      expect(url.protocol).assertEqual('https:')
    })

    it('search', 0, () => {
      expect(url.search).assertEqual('?x=1')
    })

    it('username', 0, () => {
      expect(url.username).assertEqual('')
    })

  })
}
