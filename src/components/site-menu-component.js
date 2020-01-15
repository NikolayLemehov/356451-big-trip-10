import AbstractComponent from "./abstract-component";
import {MenuName} from "../const";

const CHECKED_MENU_CLASS = `trip-tabs__btn--active`;

const createMenuTemplate = (name, isChecked) => {
  return (
    `<a class="trip-tabs__btn ${isChecked ? CHECKED_MENU_CLASS : ``}" href="#">${name}</a>`
  );
};

const createSiteMenuTemplate = (names, activeName) => {
  const menuMarkUp = names.map((name) => createMenuTemplate(name, name === activeName)).join(``);

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuMarkUp}
    </nav>`
  );
};

export default class SiteMenuComponent extends AbstractComponent {
  constructor(names) {
    super();
    this._names = names;
    this._activeMenuName = MenuName.TABLE;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._names, this._activeMenuName);
  }

  setChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A` || evt.target.classList.contains(CHECKED_MENU_CLASS)) {
        return;
      }

      this.getElement().querySelectorAll(`.trip-tabs__btn`).forEach((it) => {
        if (it.textContent === this._activeMenuName) {
          it.classList.remove(CHECKED_MENU_CLASS);
        }
      });

      evt.target.classList.add(CHECKED_MENU_CLASS);
      const menuName = evt.target.textContent;
      this._activeMenuName = menuName;

      handler(menuName);
    });
  }
}
