import nanoid from "nanoid";
import EventAdapterModel from "../models/event-adapter-model";
import DestinationAdapterModel from "../models/destination-adapter-model";
import OffersAdapterModel from "../models/offer-adapter-model";

export const StoreId = {
  EVENTS: `events`,
  DESTINATION: `destination`,
  OFFERS: `offers`,
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints()
        .then((eventAdapterModels) => {
          this._store.setEvents(eventAdapterModels.map((it) => it.getRAW()));
          return eventAdapterModels;
        });
    }
    this._isSynchronized = false;
    const storeEvents = this._store.getEvents();
    return Promise.resolve(EventAdapterModel.parseEvents(storeEvents));
  }

  createPoint(eventAdapterModel) {
    if (this._isOnLine()) {
      return this._api.createPoint(eventAdapterModel)
        .then((newEventAdapterModel) => {
          this._store.setEvent(newEventAdapterModel.id, newEventAdapterModel.getRAW());
          return newEventAdapterModel;
        });
    }
    this._isSynchronized = false;
    const fakeNewEventId = nanoid();
    const fakeNewEventAdapterModel = EventAdapterModel.parseEvent(Object
      .assign({}, eventAdapterModel.getRAW(), {id: fakeNewEventId}));

    this._store.setEvent(fakeNewEventAdapterModel.id, Object
      .assign({}, fakeNewEventAdapterModel.getRAW(), {offline: true}));
    return Promise.resolve(fakeNewEventAdapterModel);
  }

  updatePoint(id, eventAdapterModel) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, eventAdapterModel)
        .then((newEventAdapterModel) => {
          this._store.setEvent(newEventAdapterModel.id, newEventAdapterModel.getRAW());
          return newEventAdapterModel;
        });
    }
    this._isSynchronized = false;
    const fakeUpdatedEventAdapterModel = EventAdapterModel.clone(eventAdapterModel);

    this._store.setEvent(id, Object
      .assign({}, fakeUpdatedEventAdapterModel.getRAW(), {offline: true}));
    return Promise.resolve(fakeUpdatedEventAdapterModel);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id)
        .then(() => {
          this._store.removeEvent(id);
        });
    }

    this._isSynchronized = false;
    this._store.removeEvent(id);
    return Promise.resolve();
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setItem(StoreId.DESTINATION, destinations.getRAW());
          return destinations;
        });
    }

    this._isSynchronized = false;
    const storeDestinations = this._store.getItem(StoreId.DESTINATION);
    return Promise.resolve(DestinationAdapterModel.parseDestination(storeDestinations));
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setItem(StoreId.OFFERS, offers.getRAW());
          return offers;
        });
    }

    this._isSynchronized = false;
    const storeOffers = this._store.getItem(StoreId.OFFERS);
    return Promise.resolve(OffersAdapterModel.parseOffers(storeOffers));
  }

  sync() {
    if (this._isOnLine()) {
      const storeEvents = Object.values(this._store.getEvents());

      return this._api.sync(storeEvents)
        .then((response) => {
          storeEvents.filter((event) => event.offline).forEach((event) => {
            this._store.removeItem(event.id);
          });

          const createdEvents = this._getSyncedTasks(response.created);
          const updatedEvents = this._getSyncedTasks(response.updated);

          [...createdEvents, ...updatedEvents].forEach((event) => {
            this._store.setItem(event.id, event);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }

  _getSyncedTasks(items) {
    items.filter(({success}) => success).map(({payload}) => payload.point);
  }
}
