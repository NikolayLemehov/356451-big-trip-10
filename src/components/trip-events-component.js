import AbstractComponent from "./abstract-component";

const HIDDEN_ELEMENT_CLASS = `trip-events--hidden`;

export default class TripEventsComponent extends AbstractComponent {
  getTemplate() {
    return (
      `<section class="trip-events">
        <h2 class="visually-hidden">Trip events</h2>
      </section>`
    );
  }

  show() {
    super.show();
    this.getElement().classList.remove(HIDDEN_ELEMENT_CLASS);
  }

  hide() {
    super.hide();
    this.getElement().classList.add(HIDDEN_ELEMENT_CLASS);
  }
}
