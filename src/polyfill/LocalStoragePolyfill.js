import dataStorage from '@ohos.data.storage'
import featureAbility from '@ohos.ability.featureAbility'
import {Storage} from '../super-class/Storage'

/**
 * since: API 6
 */
class LocalStoragePolyfill extends Storage {

  static #storage
  static #initialized = false;

  static async init() {
    if (!LocalStoragePolyfill.#initialized) {
      const context = featureAbility.getContext();
      const path = await context.getFilesDir();
      if (!LocalStoragePolyfill.#initialized) {
        LocalStoragePolyfill.#storage = dataStorage.getStorageSync(`${path}/localStorage`)
        LocalStoragePolyfill.#initialized = true;
      }
    }
  }

  static clear() {
    LocalStoragePolyfill.#storage.clearSync();
    LocalStoragePolyfill.#storage.flushSync();
  }

  static getItem(key) {
    return LocalStoragePolyfill.#storage.hasSync(key) ? LocalStoragePolyfill.#storage.getSync(key, '\0') : null;
  }

  static removeItem(key) {
    LocalStoragePolyfill.#storage.deleteSync(key);
    LocalStoragePolyfill.#storage.flushSync();
  }

  static setItem(key, value) {
    LocalStoragePolyfill.#storage.putSync(key, value);
    LocalStoragePolyfill.#storage.flushSync();
  }
}

LocalStoragePolyfill.init();
globalThis.localStorage = globalThis.localStorage ?? LocalStoragePolyfill;
