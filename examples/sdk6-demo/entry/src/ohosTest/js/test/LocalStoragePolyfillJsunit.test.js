import 'openharmony-polyfill'
import {describe, expect, it} from 'deccjsunit/index'

describe('localStoragePolyfillTest', function () {
  it('setItemAndGetItem', 0, () => {
    localStorage.setItem('1', '2');
    localStorage.setItem('1', '3');
    const item = localStorage.getItem('1');
    expect('3').assertEqual(item);
  })

  it('removeItem', 0, () => {
    localStorage.setItem('2', '2');
    expect('2').assertEqual('2');
    localStorage.removeItem('2');
    expect(null).assertEqual(localStorage.getItem('2'))
  })

  it('clear', 0, () => {
    localStorage.setItem('3' , '4');
    localStorage.setItem('4' , '5');
    localStorage.clear();
    expect(null).assertEqual(localStorage.getItem('3'))
    expect(null).assertEqual(localStorage.getItem('4'))
  })
})
