import {StoreId} from "./provider";

export default class Store {
  constructor(storeKey, localStorage) {
    this._storeKey = storeKey;
    this._localStorage = localStorage;
    this._parsedStore = {
      [StoreId.EVENTS]: {},
      [StoreId.DESTINATION]: [],
      [StoreId.OFFERS]: [],
    };
  }

  getEvents() {
    try {
      this._parsedStore[StoreId.EVENTS] = JSON.parse(this._localStorage.getItem(this._storeKey))[StoreId.EVENTS];
      return Object.values(this._parsedStore[StoreId.EVENTS]);
    } catch (err) {
      return [];
    }
  }

  getItem(key) {
    try {
      this._parsedStore[key] = JSON.parse(this._localStorage.getItem(this._storeKey))[key];
      return this._parsedStore[key];
    } catch (err) {
      return [];
    }
  }

  setEvents(events) {
    events.forEach((it) => {
      this._parsedStore[StoreId.EVENTS][it.id] = it;
    });
    this._copyToLocalStore();
  }

  setEvent(key, value) {
    this._parsedStore[StoreId.EVENTS][key] = value;
    this._copyToLocalStore();
  }

  removeEvent(key) {
    delete this._parsedStore[StoreId.EVENTS][key];
    this._copyToLocalStore();
  }

  setItem(key, value) {
    this._parsedStore[key] = value;
    this._copyToLocalStore();
  }

  _copyToLocalStore() {
    this._localStorage.setItem(this._storeKey, JSON.stringify(Object.assign({}, this._parsedStore)));
  }
}
