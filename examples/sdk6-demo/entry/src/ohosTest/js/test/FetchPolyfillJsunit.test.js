import 'openharmony-polyfill'
import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from 'deccjsunit/index'

const server = 'https://6d61c65ec6d44d6e9a05d4188943a783.apig.cn-north-4.huaweicloudapis.com/api'

describe('fetchPolyfillTest', function () {
    it('fetch_basic', 0, async function (done) {
        const url = 'https://www.baidu.com/'
        fetch(url).then(res => {
            expect(res.bodyUsed).assertFalse();
            expect(res.url).assertEqual(url);
            expect(res.ok).assertTrue();
            expect(res.status).assertEqual(200);
            // expect(res.statusText).assertEqual('OK');
            done()
        })
    })

    it('fetch_text', 0, async function (done) {
        fetch(server).then(res => {
            expect(res.headers.get('content-type')).assertEqual('text/plain; charset=utf-8');
            expect(res.bodyUsed).assertFalse();
            return res.text().then(result => {
                expect(res.bodyUsed).assertTrue();
                expect(result).assertEqual('Default Response.');
                done()
            });
        })
    })

    it('fetch_html', 0, async function (done) {
        fetch(server+'/text').then(res => {
            expect(res.headers.get('content-type')).assertEqual('text/html; charset=utf-8');
            expect(res.bodyUsed).assertFalse();
            return res.text().then(result => {
                expect(res.bodyUsed).assertTrue();
                expect(result).assertEqual('<html><body><h2>This is http function.</h2></body></html>');
                done()
            });
        })
    })

    it('fetch_json', 0, async function (done) {
        fetch(server+'/json').then(res => {
            expect(res.headers.get('content-type')).assertEqual('application/json; charset=utf-8');
            return res.json().then(result => {
                expect(res.bodyUsed).assertTrue();
                const data = {
                    firstName: 'Fred',
                    lastName: 'Flintstone',
                    emailAddr: 'fred@example.com'
                };
                expect(JSON.stringify(result)).assertEqual(JSON.stringify(data))
                done()
            });
        })
    })
}) 