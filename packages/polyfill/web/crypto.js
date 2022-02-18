/**
 * The Crypto interface represents basic cryptography features available in the current context. It allows
 * access to a cryptographically strong random number generator and to cryptographic primitives.
 */
export class Crypto {
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

  /**
   * generate a v4 UUID using a cryptographically secure random number generator.
   */
  randomUUID() {
    const kHexDigits = [
      48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102
    ];

    const uuid = new Uint8Array(36);
    const uuidBuf = new Uint8Array(16);
    this.getRandomValues(uuidBuf);

    uuidBuf[8] = (uuidBuf[8] & 0x3f) | 0x80;
    let n = 0;
    uuid[0] = kHexDigits[uuidBuf[n] >> 4];
    uuid[1] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[2] = kHexDigits[uuidBuf[n] >> 4];
    uuid[3] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[4] = kHexDigits[uuidBuf[n] >> 4];
    uuid[5] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[6] = kHexDigits[uuidBuf[n] >> 4];
    uuid[7] = kHexDigits[uuidBuf[n++] & 0xf];
    // -
    uuid[8] = '-'.charCodeAt(0);
    uuid[9] = kHexDigits[uuidBuf[n] >> 4];
    uuid[10] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[11] = kHexDigits[uuidBuf[n] >> 4];
    uuid[12] = kHexDigits[uuidBuf[n++] & 0xf];
    // -
    uuid[13] = '-'.charCodeAt(0);
    // '4', identifies the UUID version
    uuid[14] = 52;
    uuid[15] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[16] = kHexDigits[uuidBuf[n] >> 4];
    uuid[17] = kHexDigits[uuidBuf[n++] & 0xf];
    // -
    uuid[18] = '-'.charCodeAt(0);
    uuid[19] = kHexDigits[uuidBuf[n] >> 4];
    uuid[20] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[21] = kHexDigits[uuidBuf[n] >> 4];
    uuid[22] = kHexDigits[uuidBuf[n++] & 0xf];
    // -
    uuid[23] = '-'.charCodeAt(0);
    uuid[24] = kHexDigits[uuidBuf[n] >> 4];
    uuid[25] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[26] = kHexDigits[uuidBuf[n] >> 4];
    uuid[27] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[28] = kHexDigits[uuidBuf[n] >> 4];
    uuid[29] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[30] = kHexDigits[uuidBuf[n] >> 4];
    uuid[31] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[32] = kHexDigits[uuidBuf[n] >> 4];
    uuid[33] = kHexDigits[uuidBuf[n++] & 0xf];
    uuid[34] = kHexDigits[uuidBuf[n] >> 4];
    uuid[35] = kHexDigits[uuidBuf[n] & 0xf];

    return String.fromCharCode.apply(null, uuid);
  }
}
