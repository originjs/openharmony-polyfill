import 'openharmony-polyfill'
import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from 'deccjsunit/index'

describe('xhrPolyfillTest', function () {
    it('xhr_noraml', 0, async function (done) {
        const xhr = new XMLHttpRequest()
        xhr.onload = function() {
            expect(xhr.status).assertEqual(200)
            expect(xhr.statusText).assertEqual('200')
            done()
        }
        xhr.onerror = function(err){
            console.error('Request failed')
            done()
        }
        xhr.open('GET','https://www.baidu.com/')
        xhr.send()
    })

    it('xhr_error', 0, async function (done) {
        const xhr = new XMLHttpRequest()
        xhr.onerror = function(err){
            expect(err.type).assertEqual('error')
            done()
        }
        xhr.open('GET','http://www.example.org/')
        xhr.send()
    })

    it('xhr_event', 0, async function (done) {
        const xhr = new XMLHttpRequest()
        xhr.addEventListener('loadend',()=>{
            expect(xhr.status).assertEqual(200)
            expect(xhr.statusText).assertEqual('200')
            expect(xhr.getResponseHeader('content-type')).assertEqual('text/html');
            done()
        })
        xhr.open('GET','https://www.baidu.com/')
        xhr.send()
    })
})
