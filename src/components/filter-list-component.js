import AbstractComponent from "./abstract-component";

const FILTER_ID_PREFIX = `filter-`;

const createFilterTemplate = (name, isChecked) => {
  return (
    `<div class="trip-filters__filter">
      <input 
      id="${FILTER_ID_PREFIX}${name}" 
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

export default class FilterListComponent extends AbstractComponent {
  constructor(filterToChecked) {
    super();
    this._filterToChecked = filterToChecked;
  }

  getTemplate() {
    return createFiltersTemplate(this._filterToChecked);
  }

  setFilterTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterType = evt.target.id.substring(FILTER_ID_PREFIX.length);
      handler(filterType);
    });
  }
}
