const createFilterElement = (name, isChecked) => {
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

const createFilterTemplate = (names) => {
  const filterMarkUp = names.map((name, i) => createFilterElement(name, i === 0)).join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterMarkUp}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export {createFilterTemplate};
