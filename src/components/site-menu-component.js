import AbstractComponent from "./abstract-component";

const CHECKED_MENU_NUMBER = 1;

const createMenuTemplate = (name, isChecked) => {
  return (
    `<a class="trip-tabs__btn ${isChecked ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>`
  );
};

const createSiteMenuTemplate = (names) => {
  const menuMarkUp = names.map((name, i) => createMenuTemplate(name, i === CHECKED_MENU_NUMBER - 1)).join(``);

  return (
    `<h2 class="visually-hidden">Switch trip view</h2>
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuMarkUp}
    </nav>`
  );
};

export default class SiteMenuComponent extends AbstractComponent {
  constructor(names) {
    super();
    this._names = names;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._names);
  }
}
