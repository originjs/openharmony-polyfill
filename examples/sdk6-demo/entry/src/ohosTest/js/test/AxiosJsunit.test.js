import 'openharmony-polyfill';
import axios from 'axios';
import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from 'deccjsunit/index';

const server = 'https://6d61c65ec6d44d6e9a05d4188943a783.apig.cn-north-4.huaweicloudapis.com/api';

describe('axiosTest', function () {
    it('axios_normal', 0, async function (done) {
        axios.get(server).then(function (res) {
            expect(res.data).assertEqual('Default Response.');
            done();
        }).catch(function (err) {
            expect.assertFail();
            done();
        });
    });

    it('axios_timeout', 0, async function (done) {
        axios.get(server + '/timeout', {
            timeout: '250'
        }).then(function (res) {
            expect.assertFail();
            done();
        }).catch(function (err) {
            expect(err.message).assertEqual('Network Error');
            done();
        });
    });

    it('axios_json', 0, async function (done) {
        axios.get(server + '/json').then(function (res) {
            const data = {
                firstName: 'Fred',
                lastName: 'Flintstone',
                emailAddr: 'fred@example.com'
            };
            expect(JSON.stringify(res.data)).assertEqual(JSON.stringify(data));
            done();
        }).catch(function (err) {
            expect.assertFail();
            done();
        });
    });

    it('axios_json_bom', 0, async function (done) {
        axios.get(server + '/json-bom').then(function (res) {
            const data = {
                firstName: 'Fred',
                lastName: 'Flintstone',
                emailAddr: 'fred@example.com'
            };
            expect(JSON.stringify(res.data)).assertEqual(JSON.stringify(data));
            done();
        }).catch(function (err) {
            expect.assertFail();
            done();
        });
    });

    it('axios_zip_json', 0, async function (done) {
        axios.get(server + '/zip-json').then(function (res) {
            const data = {
                firstName: 'Fred',
                lastName: 'Flintstone',
                emailAddr: 'fred@example.com'
            };
            expect(JSON.stringify(res.data)).assertEqual(JSON.stringify(data));
            done();
        }).catch(function (err) {
            expect.assertFail();
            done();
        });
    });

    it('axios_zip_text', 0, async function (done) {
        axios.get(server + '/zip-text').then(function (res) {
            expect(res.data).assertEqual('Test data');
            done();
        }).catch(function (err) {
            expect.assertFail();
            done();
        });
    });

    it('axios_utf8', 0, async function (done) {
        axios.get(server + '/utf8').then(function (res) {
            const str = Array(100000).join('ж');
            expect(res.data).assertEqual(str);
            done();
        }).catch(function (err) {
            expect.assertFail();
            done();
        });
    });

    it('axios_post', 0, async function (done) {
        axios.post(server + '/post',
            { foo: 'bar' })
            .then(function (res) {
                expect(res.status).assertEqual(200);
                expect(res.data.foo).assertEqual('bar');
                done();
            }).catch(function (err) {
            expect.assertFail();
            done();
        });
    });

    it('axios_binary', 0, async function (done) {
        axios.get('https://developer.mozilla.org/favicon-48x48.97046865.png',
            { responseType: 'arraybuffer' })
            .then(function (res) {
                let data = res.data;
                expect(data.length).assertEqual(2);
                expect(data[0]).assertEqual(1);
                expect(data[1]).assertEqual(2);
                done();
            }).catch(function (err) {
            expect.assertFail();
            done();
        });
    });
});