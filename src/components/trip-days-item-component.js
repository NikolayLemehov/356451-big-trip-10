import AbstractComponent from './abstract-component';

export default class TripDaysItemComponent extends AbstractComponent {
  getTemplate() {
    return (
      `<li class="trip-days__item  day"></li>`
    );
  }
}
