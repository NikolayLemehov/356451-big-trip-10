import AbstractComponent from "./abstract-component";

const createTripInfoTemplate = (events) => {
  const totalCost = events.reduce((total, event) => total + event.price, 0);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export default class TripInfoCostComponent extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
