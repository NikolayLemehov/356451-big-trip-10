import AbstractSmartComponent from './abstract-smart-component';

const createTripInfoTemplate = (events) => {
  const totalCost = events.reduce((total, event) => total + event.price + event.offers
    .reduce((acc, offer) => offer.isChecked ? acc + offer.price : acc, 0), 0);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export default class TripInfoCostComponent extends AbstractSmartComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }

  rerender(events) {
    this._events = events;
    super.rerender(this._events);
  }

  recoveryListeners() {}
}
