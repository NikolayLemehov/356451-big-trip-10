export default class OffersAdapterModel {
  constructor(endData) {
    this.endOffers = endData;
    this.typeToOffers = this.endOffers.reduce((acc, type) => {
      return acc.set(type[`type`], type[`offers`]
        .map((offer, i) => Object.assign({}, offer, {
          id: i,
          name: `${type[`type`]}-${i}`,
          isChecked: false,
        })));
    }, new Map());
  }

  static parseOffers(endData) {
    return new OffersAdapterModel(endData);
  }
}
