import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from "deccjsunit/index"
import 'openharmony-polyfill';

export default function XhrPolyfillJsunit() {
  describe('xhrPolyfillTest', function () {
    it('xhr_normal', 0, async function (done) {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        expect(xhr.status).assertEqual(200);
        expect(xhr.statusText).assertEqual('OK');
        done();
      };
      xhr.onerror = function(err){
        console.error('Request failed');
        done();
      };
      xhr.open('GET','https://www.baidu.com/');
      xhr.send();
    });

    it('xhr_error', 0, async function (done) {
      const xhr = new XMLHttpRequest();
      xhr.onerror = function(err){
        expect(err.type).assertEqual('error');
        done();
      };
      xhr.open('GET','http://www.example.org/');
      xhr.send();
    });

    it('xhr_event', 0, async function (done) {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('loadend',()=>{
        expect(xhr.status).assertEqual(200);
        expect(xhr.statusText).assertEqual('OK');
        expect(xhr.getResponseHeader('content-type')).assertEqual('text/html');

//        expect(xhr.response).assertEqual('OK');
//        expect(xhr.responseURL).assertEqual('OK');
//        expect(xhr.responseType).assertEqual('OK');
        done();
      });
      xhr.open('GET','https://www.baidu.com/');
      xhr.send();
    });
  });
}
