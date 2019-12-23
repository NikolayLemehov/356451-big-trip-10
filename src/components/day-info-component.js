import AbstractComponent from "./abstract-component";
import {MONTHS} from "../const";

const createDayInfoTemplate = (dayEvents, dayCount) => {
  const date = dayEvents[0].date.start;
  const dateTime = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const month = `${MONTHS[date.getMonth()]}`;

  return (
    `<div class="day__info">
      <span class="day__counter">${dayCount}</span>
      <time class="day__date" datetime="${dateTime}">${month} ${date.getDate()}</time>
    </div>`
  );
};

export default class DayInfoComponent extends AbstractComponent {
  constructor(eventsDays, dayCounts) {
    super();
    this._eventsDays = eventsDays;
    this._dayCounts = dayCounts;
  }

  getTemplate() {
    return createDayInfoTemplate(this._eventsDays, this._dayCounts);
  }
}
