export default class EventAdapterModel {
  constructor(endData) {
    this.id = endData[`id`];
    this.type = endData[`type`];
    this.city = endData[`destination`][`name`];
    this.photos = Array.from(endData[`destination`][`pictures`]).map((it) => it[`src`]);
    this.destination = endData[`destination`][`description`];
    this.date = {
      start: endData[`date_from`] ? new Date(endData[`date_from`]) : null,
      end: endData[`date_to`] ? new Date(endData[`date_to`]) : null,
    };
    this.price = endData[`base_price`];
    this.offers = Array.from(endData[`offers`]).map((it) => {
      return {
        name: `meal`,
        title: it[`title`],
        price: it[`price`],
      };
    });
    this.isFavorite = endData[`is_favorite`];
    this.isNewEvent = false;
  }

  static parseEvent(endData) {
    return new EventAdapterModel(endData);
  }

  static parseEvents(endData) {
    return endData.map(EventAdapterModel.parseEvent);
  }
}
