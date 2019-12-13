import {createElement} from "../utils";

export default class TripDays {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return (
      `<ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info"></div>
      </li>
    </ul>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
