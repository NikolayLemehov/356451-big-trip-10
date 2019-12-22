import AbstractComponent from "./abstract-component";

export default class TripDayListComponent extends AbstractComponent {
  getTemplate() {
    return (
      `<ul class="trip-days">
        <li class="trip-days__item  day">
          <div class="day__info"></div>
        </li>
      </ul>`
    );
  }
}
