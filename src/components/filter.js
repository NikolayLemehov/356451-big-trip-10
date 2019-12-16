import {createElement} from "../utils";

const createFilterTemplate = (name, isChecked) => {
  return (
    `<div class="trip-filters__filter">
      <input 
      id="filter-${name}" 
      class="trip-filters__filter-input  visually-hidden" 
      type="radio" 
      name="trip-filter" 
      value="${name}"
      ${isChecked ? `checked` : ``} 
      >
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`
  );
};

const createFiltersTemplate = (filterToChecked) => {
  const filterMarkUp = [...filterToChecked.keys()].map((key) => createFilterTemplate(key, filterToChecked.get(key))).join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterMarkUp}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterList {
  constructor(filterToChecked) {
    this._filterToChecked = filterToChecked;
    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filterToChecked);
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
