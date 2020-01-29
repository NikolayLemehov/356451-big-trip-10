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
        id: null,
        name: ``,
        title: it[`title`],
        price: it[`price`],
        isChecked: true,
      };
    });
    this.isFavorite = endData[`is_favorite`];
  }

  getRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'date_from': this.date.start,
      'date_to': this.date.end,
      'destination': {
        'name': this.destination.city,
        'description': this.destination.description,
        'pictures': this.destination.photos.map((it) => {
          return {
            'src': it.src,
            'description': it.description,
          };
        }),
      },
      'base_price': Number(this.price),
      'is_favorite': this.isFavorite,
      'offers': this.offers.filter((it) => it.isChecked).map((it) => {
        return {
          'title': it.title,
          'price': it.price,
        };
      }),
    };
  }

  static replenishOffers(typeOffers, eventAdapterModel) {
    typeOffers.forEach((typeOffer) => {
      const findingOffer = eventAdapterModel.offers.find((it) => it.title === typeOffer.title);
      if (findingOffer) {
        findingOffer.id = typeOffer.id;
        findingOffer.name = typeOffer.name;
      } else {
        eventAdapterModel.offers.push(typeOffer);
      }
    });
    eventAdapterModel.offers.sort((a, b) => a.id - b.id);
    return eventAdapterModel;
  }

  static parseEvent(endData) {
    return new EventAdapterModel(endData);
  }

  static parseEvents(endData) {
    return endData.map(EventAdapterModel.parseEvent);
  }

  static clone(eventAdapterModel) {
    return new EventAdapterModel(eventAdapterModel.getRAW());
  }
}
