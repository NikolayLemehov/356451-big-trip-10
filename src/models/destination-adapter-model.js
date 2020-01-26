export default class DestinationAdapterModel {
  constructor(endData) {
    this._endData = endData;
    this.destinations = endData.map((it) => {
      return {
        city: it[`name`],
        description: it[`description`],
        photos: it[`pictures`].map((photo) => {
          return {
            src: photo[`src`],
            description: photo[`description`],
          };
        }),
      };
    });
  }

  getRAW() {
    return this._endData.slice();
  }

  static parseDestination(endData) {
    return new DestinationAdapterModel(endData);
  }
}
