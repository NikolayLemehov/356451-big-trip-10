import {createElement} from "../utils";

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

export default class SiteMenu {
  constructor(names) {
    this._names = names;
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._names);
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
