const createMenuElement = (name, isChecked) => {
  return (
    `<a class="trip-tabs__btn ${isChecked ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`
  );
};

const createSiteMenuTemplate = (names) => {
  const menuMarkUp = names.map((name, i) => createMenuElement(name, i === 0)).join(``);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuMarkUp}
    </nav>`
  );
};

export {createSiteMenuTemplate};