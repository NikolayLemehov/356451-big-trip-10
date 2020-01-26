export default class OffersAdapterModel {
  constructor(endData) {
    this._endData = endData;
    this.typeToOffers = endData.reduce((acc, type) => {
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

  getRAW() {
    return this._endData.slice();
  }

  static parseOffers(endData) {
    return new OffersAdapterModel(endData);
  }
}
