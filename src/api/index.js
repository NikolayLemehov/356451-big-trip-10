import EventAdapterModel from "../models/event-adapter-model";
import DestinationAdapterModel from "../models/destination-adapter-model";
import OffersAdapterModel from "../models/offer-adapter-model";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class Index {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then(EventAdapterModel.parseEvents);
  }

  createPoint(eventAdapterModel) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(eventAdapterModel.getRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(EventAdapterModel.parseEvent);
  }

  updatePoint(id, eventAdapterModel) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(eventAdapterModel.getRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(EventAdapterModel.parseEvent);
  }

  deletePoint(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then((response) => response.json())
      .then(DestinationAdapterModel.parseDestination);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then((response) => response.json())
      .then(OffersAdapterModel.parseOffers);
  }

  sync(data) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
