import AbstractComponent from './abstract-component';

const FILTER_ID_PREFIX = `filter-`;

const createFilterTemplate = ({name, isChecked}) => {
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

const createFiltersTemplate = (filters) => {
  const filterMarkUp = filters.map((it) => createFilterTemplate(it)).join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterMarkUp}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterListComponent extends AbstractComponent {
  constructor(filters) {
    super();
    this._filtes = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filtes);
  }

  setFilterTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      evt.preventDefault();
      const filterType = evt.target.id.substring(FILTER_ID_PREFIX.length);
      handler(filterType);
    });
  }
}
