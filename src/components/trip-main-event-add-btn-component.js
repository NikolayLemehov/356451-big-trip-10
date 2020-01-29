import AbstractComponent from './abstract-component';

export default class TripMainEventAddBtnComponent extends AbstractComponent {
  getTemplate() {
    return (
      `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
    );
  }

  setAddButtonClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  disableBtn() {
    this.getElement().disabled = `disabled`;
  }

  activeBtn() {
    this.getElement().disabled = ``;
  }
}
