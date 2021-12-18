import 'openharmony-polyfill'
import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from 'deccjsunit/index'

describe('fetchPolyfillTest', function () {
    it('fetch_basic', 0, async function (done) {
        fetch('https://developer.harmonyos.com/cn/develop/')
            .then(res => {
                expect(res.status).assertEqual(200)
                done()
            })
    })
}) 