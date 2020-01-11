import AbstractComponent from "./abstract-component";
import {SortType} from "../const";

const createTripSortTemplate = () => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" checked>
        <label class="trip-sort__btn" data-sort-type="${SortType.EVENT}" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
        <label class="trip-sort__btn" data-sort-type="${SortType.TIME}" for="sort-time">
          Time
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
        <label class="trip-sort__btn" data-sort-type="${SortType.PRICE}" for="sort-price">
          Price
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class TripSortComponent extends AbstractComponent {
  constructor() {
    super();

    this._currenSortType = SortType.EVENT;
    this._span = this.getElement().querySelector(`.trip-sort__item--day`);
    this._form = this.getElement();
  }

  getTemplate() {
    return createTripSortTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (!evt.target.classList.contains(`trip-sort__btn`)) {
        return;
      }

      const sortType = evt.target.dataset.sortType;


      if (this._currenSortType === sortType) {
        return;
      }

      this._form.querySelector(`#sort-${this._currenSortType}`).removeAttribute(`checked`);
      this._form.querySelector(`#sort-${sortType}`).setAttribute(`checked`, `checked`);

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }

  hideDate() {
    this._span.innerHTML = ``;
  }

  showDate() {
    this._span.text = `Day`;
  }
}