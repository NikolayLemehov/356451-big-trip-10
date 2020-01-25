export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    this._api.getPoints();
  }

  createPoint(eventAdapterModel) {
    this._api.createPoint(eventAdapterModel);
  }

  updatePoint(id, eventAdapterModel) {
    this._api.updatePoint(id, eventAdapterModel);
  }

  deletePoint(id) {
    this._api.deletePoint(id);
  }

  getDestinations() {
    this._api.getDestinations();
  }

  getOffers() {
    this._api.getOffers();
  }
}
