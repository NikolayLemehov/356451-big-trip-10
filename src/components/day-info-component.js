import AbstractComponent from "./abstract-component";
import moment from "moment";

const createDayInfoTemplate = (date, dayCount = null) => {
  let dayInfoContent = ``;
  if (dayCount) {
    const dateTime = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const month = moment(date).format(`MMM`);
    dayInfoContent = `<span class="day__counter">${dayCount}</span>
    <time class="day__date" datetime="${dateTime}">${month} ${date.getDate()}</time>`;
  }

  return (
    `<div class="day__info">
      ${dayInfoContent}
    </div>`
  );
};

export default class DayInfoComponent extends AbstractComponent {
  constructor(isEmpty, date, dayCounts) {
    super();
    this._date = date;
    this._dayCounts = dayCounts;
    this._isEmpty = isEmpty;
  }

  getTemplate() {
    return createDayInfoTemplate(this._isEmpty, this._date, this._dayCounts);
  }
}
