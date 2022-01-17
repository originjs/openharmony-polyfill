import {Base64, extendString} from 'js-base64';
import {describe, beforeAll, beforeEach, afterEach, afterAll, it, expect} from "deccjsunit/index"

export default function Base64Js() {

  const is = (a, b) => expect(a).assertEqual(b);


  describe('atob-basic', function () {
    it('d', 0, () => is(Base64.btoa('d'), 'ZA=='));
    it('da', 0, () => is(Base64.btoa('da'), 'ZGE='));
    it('dan', 0, () => is(Base64.btoa('dan'), 'ZGFu'));
    it('ZA==', 0, () => is(Base64.atob('ZA=='), 'd'));
    it('ZGE=', 0, () => is(Base64.atob('ZGE='), 'da'));
    it('ZGFu', 0, () => is(Base64.atob('ZGFu'), 'dan'));
  });

  describe('atob-whitespace', function () {
    it('Z A==', 0, () => is(Base64.atob('ZA =='), 'd'));
    it('ZG E=', 0, () => is(Base64.atob('ZG E='), 'da'));
    it('ZGF u', 0, () => is(Base64.atob('ZGF u'), 'dan'));
  });

  describe('atob-null', function () {
    it('\\0', 0, () => is(Base64.btoa('\0'), 'AA=='));
    it('\\0\\0', 0, () => is(Base64.btoa('\0\0'), 'AAA='));
    it('\\0\\0\\0', 0, () => is(Base64.btoa('\0\0\0'), 'AAAA'));
    it('AA==', 0, () => () => is(Base64.atob('AA=='), '\0'));
    it('AAA=', 0, () => is(Base64.atob('AAA='), '\0\0'));
    it('AAAA', 0, () => is(Base64.atob('AAAA'), '\0\0\0'));
  });

  describe('atob-binary', function () {
    var pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    var pngBinary = '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x04\x00\x00\x00\xb5\x1c\x0c\x02\x00\x00\x00\x0b\x49\x44\x41\x54\x78\xda\x63\x64\x60\x00\x00\x00\x06\x00\x02\x30\x81\xd0\x2f\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82';
    it('.btoa', 0, () => is(Base64.btoa(pngBinary), pngBase64));
    it('.atob', 0, () => is(Base64.atob(pngBase64), pngBinary));
  });


  describe('dankogai-basic', function () {
    it('d', 0, () => is(Base64.encode('d'), 'ZA=='));
    it('da', 0, () => is(Base64.encode('da'), 'ZGE='));
    it('dan', 0, () => is(Base64.encode('dan'), 'ZGFu'));
    it('ZA==', 0, () => is(Base64.decode('ZA=='), 'd'));
    it('ZGE=', 0, () => is(Base64.decode('ZGE='), 'da'));
    it('ZGFu', 0, () => is(Base64.decode('ZGFu'), 'dan'));
  });

  describe('dankogai-whitespace', function () {
    it('Z A==', 0, () => is(Base64.decode('Z A=='), 'd'));
    it('ZG E=', 0, () => is(Base64.decode('ZG E='), 'da'));
    it('ZGF u', 0, () => is(Base64.decode('ZGF u'), 'dan'));
  });

  describe('dankogai-null', function () {
    it('\\0', 0, () => is(Base64.encode('\0'), 'AA=='));
    it('\\0\\0', 0, () => is(Base64.encode('\0\0'), 'AAA='));
    it('\\0\\0\\0', 0, () => is(Base64.encode('\0\0\0'), 'AAAA'));
    it('AA==', 0, () => is(Base64.decode('AA=='), '\0'));
    it('AAA=', 0, () => is(Base64.decode('AAA='), '\0\0'));
    it('AAAA', 0, () => is(Base64.decode('AAAA'), '\0\0\0'));
  });

  describe('dankogai-Base64', function () {
    it('.encode', 0, () => is(Base64.encode('小飼弾'), '5bCP6aO85by+'));
    it('.encodeURI', 0, () => is(Base64.encodeURI('小飼弾'), '5bCP6aO85by-'));
    it('.decode', 0, () => is(Base64.decode('5bCP6aO85by+'), '小飼弾'));
    it('.decode', 0, () => is(Base64.decode('5bCP6aO85by-'), '小飼弾'));
  });

  describe('dankogai-isValid', function () {
    it('', 0, () => is(Base64.isValid(''), true));
    it('0', 0, () => is(Base64.isValid(0), false));
    it('Z', 0, () => is(Base64.isValid('Z'), true));
    it('ZA', 0, () => is(Base64.isValid('ZA'), true));
    it('ZA=', 0, () => is(Base64.isValid('ZA='), true));
    it('ZA==', 0, () => is(Base64.isValid('ZA=='), true));
    it('++', 0, () => is(Base64.isValid('++'), true));
    it('+-', 0, () => is(Base64.isValid('+-'), false));
    it('--', 0, () => is(Base64.isValid('--'), true));
    it('//', 0, () => is(Base64.isValid('//'), true));
    it('__', 0, () => is(Base64.isValid('__'), true));
    it('/_', 0, () => is(Base64.isValid('/_'), false));
  });

  if (typeof Uint8Array === 'function') describe('fromUint8Array', function () {
    it('dankogai', 0, () => is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111, 103, 97, 105])), Base64.encode('dankogai')));
    it('dankoga', 0, () => is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111, 103, 97])), Base64.encode('dankoga')));
    it('dankog', 0, () => is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111, 103])), Base64.encode('dankog')));
    it('danko', 0, () => is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107, 111])), Base64.encode('danko')));
    it('dank', 0, () => is(Base64.fromUint8Array(new Uint8Array([100, 97, 110, 107])), Base64.encode('dank')));
    it('dan', 0, () => is(Base64.fromUint8Array(new Uint8Array([100, 97, 110])), Base64.encode('dan')));
    it('da', 0, () => is(Base64.fromUint8Array(new Uint8Array([100, 97])), Base64.encode('da')));
    it('d', 0, () => is(Base64.fromUint8Array(new Uint8Array([100])), Base64.encode('d')));
    it('', 0, () => is(Base64.fromUint8Array(new Uint8Array([])), Base64.encode('')));
  });

  if (typeof Uint8Array === 'function') describe('toUint8Array', function () {
    var _2str = function (a) {
      return Array.prototype.slice.call(a, 0).toString();
    }
    it('ZGFua29nYWk=', 0, () => is(_2str(Base64.toUint8Array('ZGFua29nYWk=')), '100,97,110,107,111,103,97,105'));
    it('ZGFua29nYQ==', 0, () => is(_2str(Base64.toUint8Array('ZGFua29nYQ==')), '100,97,110,107,111,103,97'));
    it('ZGFua29n', 0, () => is(_2str(Base64.toUint8Array('ZGFua29n')), '100,97,110,107,111,103'));
    it('ZGFua28=', 0, () => is(_2str(Base64.toUint8Array('ZGFua28=')), '100,97,110,107,111'));
    it('ZGFuaw==', 0, () => is(_2str(Base64.toUint8Array('ZGFuaw==')), '100,97,110,107'));
    it('ZGFu', 0, () => is(_2str(Base64.toUint8Array('ZGFu')), '100,97,110'));
    it('ZGE=', 0, () => is(_2str(Base64.toUint8Array('ZGE=')), '100,97'));
    it('ZA==', 0, () => is(_2str(Base64.toUint8Array('ZA==')), '100'));
    it('', 0, () => is(_2str(Base64.toUint8Array('')), ''));
  });

  describe('es5-String', () => {
    if (typeof Base64.extendString == 'function') {
      // @ts-ignore
      delete String.prototype.fromBase64;
      // @ts-ignore
      delete String.prototype.toBase64;
      // @ts-ignore
      delete String.prototype.toBase64URI;
      // @ts-ignore
      delete String.prototype.toBase64URL;
      // @ts-ignore
      delete String.prototype.toUint8Array;
      Base64.extendString();
      // @ts-ignore
      it('.toBase64', 0, () => is('小飼弾'.toBase64(), '5bCP6aO85by+'));

      // @ts-ignore
      it('.toBase64', 0, () => is('小飼弾'.toBase64(true), '5bCP6aO85by-'));

      // @ts-ignore
      it('.toBase64URI', 0, () => is('小飼弾'.toBase64URI(), '5bCP6aO85by-'));

      // @ts-ignore
      it('.fromBase64', 0, () => is('5bCP6aO85by+'.fromBase64(), '小飼弾'));

      // @ts-ignore
      it('.fromBase64', 0, () => is('5bCP6aO85by-'.fromBase64(), '小飼弾'));
    }
  })

  describe('es6-String', function() {

    // @ts-ignore
    delete String.prototype.fromBase64;
    // @ts-ignore
    delete String.prototype.toBase64;
    // @ts-ignore
    delete String.prototype.toBase64URI;
    // @ts-ignore
    delete String.prototype.toBase64URL;
    // @ts-ignore
    delete String.prototype.toUint8Array;
    extendString();

    // @ts-ignore
    it('.toBase64', 0, () => is('小飼弾'.toBase64(), '5bCP6aO85by+'));
    // @ts-ignore
    it('.toBase64', 0, () => is('小飼弾'.toBase64(true), '5bCP6aO85by-'));
    // @ts-ignore
    it('.toBase64URI', 0, () => is('小飼弾'.toBase64URI(), '5bCP6aO85by-'));
    // @ts-ignore
    it('.fromBase64', 0, () => is('5bCP6aO85by+'.fromBase64(), '小飼弾'));
    // @ts-ignore
    it('.fromBase64', 0, () => is('5bCP6aO85by-'.fromBase64(), '小飼弾'));
  });


  var seed = function(){
    var a, i;
    for (a = [], i = 0; i < 32; i++) {
      a.push(String.fromCharCode(i));
    }
    return a.join('');
  }();
  describe('Large-Base64', function () {
    for (var i = 0, str = seed; i < 16; str += str, i++) {
      it('' + str.length, 0, () => is(Base64.decode(Base64.encode(str)), str));
    }
  });


  describe('Yoshinoya',function(){
    it('.encode', 0, () => is(Base64.encode('𠮷野家'), '8KCut+mHjuWutg=='));
    it('.encodeURI', 0, () => is(Base64.encodeURI('𠮷野家'), '8KCut-mHjuWutg'));
    it('.decode', 0, () => is(Base64.decode('8KCut+mHjuWutg=='), '𠮷野家'));
    it('.decode', 0, () => is(Base64.decode('8KCut-mHjuWutg'), '𠮷野家'));
  });


}
