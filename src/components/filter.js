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
const createFilterMarkUp = (filterToChecked) => {
  const array = [];
  for (const key of filterToChecked.keys()) {
    array.push(createFilterTemplate(key, filterToChecked.get(key)));
  }
  return array.join(``);
};

const createFiltersTemplate = (filterToChecked) => {
  const filterMarkUp = createFilterMarkUp(filterToChecked);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterMarkUp}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export {createFiltersTemplate};
