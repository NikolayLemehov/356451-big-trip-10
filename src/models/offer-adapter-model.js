export default class OffersAdapterModel {
  constructor(endData) {
    this.endOffers = endData;
    this.typeToOffers = this.endOffers.reduce((acc, type) => {
      return acc.set(type[`type`], type[`offers`]
        .map((offer, i) => {
          return {
            id: i,
            name: `event-offer-${type[`type`]}-${i}`,
            title: offer[`title`],
            price: offer[`price`],
            isChecked: false,
          };
        }));
    }, new Map());
  }

  static parseOffers(endData) {
    return new OffersAdapterModel(endData);
  }
}
