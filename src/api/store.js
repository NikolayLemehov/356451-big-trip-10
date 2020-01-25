export default class Store {
  constructor(storeKey, localStorage) {
    this._storeKey = storeKey;
    this._localStorage = localStorage;
  }

  getAll() {
    try {
      return JSON.parse(this._localStorage.getItem(this._storeKey));
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getAll();
    this._localStorage.setItem(this._storeKey, JSON.stringify(Object.assign({}, store, {[key]: value})));
  }

  removeItem(key) {
    const store = this.getAll();
    delete store[key];
    this._localStorage.setItem(this._storeKey, JSON.stringify(Object.assign({}, store)));
  }
}
