import AbstractComponent from "./abstract-component";
import {SortType} from "../const";

const SORT_ID_PREFIX = `sort-`;
const SVG_TEMPLATE = (
  `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
    <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
  </svg>`
);

const createTripSortItemTemplate = ({name, isChecked, haveSvg}) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${name}">
      <input id="${SORT_ID_PREFIX}${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}"
        ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn" data-sort-type="${name}" for="sort-${name}">${name}${haveSvg ? SVG_TEMPLATE : ``}</label>
    </div>`
  );
};

const createTripSortTemplate = (sorts) => {
  const sortMarkUp = sorts.map((it) => createTripSortItemTemplate(it)).join(``);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortMarkUp}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class TripSortComponent extends AbstractComponent {
  constructor(sorts) {
    super();

    this._sorts = sorts;
    this._daySpanElement = this.getElement().querySelector(`.trip-sort__item--day`);
  }

  getTemplate() {
    return createTripSortTemplate(this._sorts);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      evt.preventDefault();
      const sortType = evt.target.id.substring(SORT_ID_PREFIX.length);

      if (sortType === SortType.EVENT) {
        this._daySpanElement.textContent = `Day`;
      } else {
        this._daySpanElement.innerHTML = ``;
      }
      handler(sortType);
    });
  }
}
