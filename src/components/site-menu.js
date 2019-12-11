const CHECKED_MENU_NUMBER = 1;

const createMenuTemplate = (name, isChecked) => {
  return (
    `<a class="trip-tabs__btn ${isChecked ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`
  );
};

const createSiteMenuTemplate = (names) => {
  const menuMarkUp = names.map((name, i) => createMenuTemplate(name, i === CHECKED_MENU_NUMBER - 1)).join(``);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuMarkUp}
    </nav>`
  );
};

export {createSiteMenuTemplate};
