import dataStorage from '@ohos.data.storage';
import featureAbility from '@ohos.ability.featureAbility';


export class Storage {
  static key(n) {}

  static length() {}

  static getItem(key) {}

  static setItem(key, val) {}

  static removeItem(key) {}

  static clear() {}
}

/**
 * since: API 6
 */
export class LocalStorage extends Storage {
  static #storage;
  static #initialized = false;

  static async init() {
    if (!LocalStorage.#initialized) {
      const context = featureAbility.getContext();
      const path = await context.getFilesDir();
      if (!LocalStorage.#initialized) {
        LocalStorage.#storage = dataStorage.getStorageSync(
          `${path}/localStorage`
        );
        LocalStorage.#initialized = true;
      }
    }
  }

  static clear() {
    LocalStorage.#storage.clearSync();
    LocalStorage.#storage.flushSync();
  }

  static getItem(key) {
    return LocalStorage.#storage.hasSync(key)
      ? LocalStorage.#storage.getSync(key, '\0')
      : null;
  }

  static removeItem(key) {
    LocalStorage.#storage.deleteSync(key);
    LocalStorage.#storage.flushSync();
  }

  static setItem(key, value) {
    LocalStorage.#storage.putSync(key, value);
    LocalStorage.#storage.flushSync();
  }
}
