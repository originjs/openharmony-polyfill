/**
 * The Crypto interface represents basic cryptography features available in the current context. It allows
 * access to a cryptographically strong random number generator and to cryptographic primitives.
 */
class Crypto {
  /**
   * Fills the passed TypedArray with cryptographically sound random values.
   * @param {*} typedArray
   */
  getRandomValues(typedArray) {
    if (
      !(
        typedArray instanceof Int8Array ||
        typedArray instanceof Uint8Array ||
        typedArray instanceof Int16Array ||
        typedArray instanceof Uint16Array ||
        typedArray instanceof Int32Array ||
        typedArray instanceof Uint32Array ||
        typedArray instanceof Uint8ClampedArray
      )
    ) {
      throw new TypeError('Expected an integer array!');
    }
    for (let i = 0, r; i < typedArray.length; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      typedArray[i] = (r >>> ((i & 0x03) << 3)) & 0xff;
    }
    return typedArray;
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = new Crypto();
}
