export default class DestinationAdapterModel {
  constructor(endData) {
    this.endData = endData;
  }

  static parseDestination(endData) {
    return new DestinationAdapterModel(endData);
  }
}
