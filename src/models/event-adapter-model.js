export default class EventAdapterModel {
  constructor(endData) {
    this.id = endData[`id`];
    this.type = endData[`type`];
    this.destination = {
      city: endData[`destination`][`name`],
      description: endData[`destination`][`description`],
      photos: Array.from(endData[`destination`][`pictures`]).map((it) => {
        return {
          src: it[`src`],
          description: it[`description`],
        };
      }),
    };
    this.date = {
      start: endData[`date_from`] ? new Date(endData[`date_from`]) : null,
      end: endData[`date_to`] ? new Date(endData[`date_to`]) : null,
    };
    this.price = endData[`base_price`];
    this.offers = Array.from(endData[`offers`]).map((it) => {
      return {
        title: it[`title`],
        price: it[`price`],
        id: null,
        name: ``,
        isChecked: true,
      };
    });
    this.isFavorite = endData[`is_favorite`];
    this.isNewEvent = false;
  }

  replenishOffers(typeOffers) {
    typeOffers.forEach((typeOffer) => {
      const findingOffer = this.offers.find((it) => it.title === typeOffer.title);
      if (findingOffer) {
        findingOffer.id = typeOffer.id;
        findingOffer.name = typeOffer.name;
      } else {
        this.offers.push(typeOffer);
      }
    });
  }

  static parseEvent(endData) {
    return new EventAdapterModel(endData);
  }

  static parseEvents(endData) {
    return endData.map(EventAdapterModel.parseEvent);
  }
}
