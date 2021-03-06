import AbstractSmartComponent from './abstract-smart-component';
import moment from 'moment';

const getPeriod = (events) => {
  const startDate = new Date(events[0].date.start);
  const endDate = new Date(events[events.length - 1].date.end);

  if (startDate.getMonth() === endDate.getMonth()) {
    return {
      start: `${moment(startDate).format(`MMM`)} ${startDate.getDate()}`,
      end: `${endDate.getDate()}`,
    };
  } else {
    return {
      start: `${startDate.getDate()} ${moment(startDate).format(`MMM`)}`,
      end: `${endDate.getDate()} ${moment(endDate).format(`MMM`)}`,
    };
  }
};

const getCitiesText = (events) => {
  const cities = events.map((event) => event.destination.city).map((city, i, arr) => city === arr[i + 1] ? `` : city).filter(Boolean);
  const startCity = cities[0];
  const endCity = cities[cities.length - 1];
  const middleCity = cities.length > 3 ? `...` : cities[1];
  switch (cities.length) {
    case 1:
      return `${startCity}`;
    case 2:
      return `${startCity} &mdash; ${endCity}`;
    default:
      return `${startCity} &mdash; ${middleCity} &mdash; ${endCity}`;
  }
};

const createTripInfoTemplate = (events) => {
  const citiesText = getCitiesText(events);
  const date = getPeriod(events);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${citiesText}</h1>
      <p class="trip-info__dates">${date.start} &mdash; ${date.end}</p>
    </div>`
  );
};

export default class TripInfoMainComponent extends AbstractSmartComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }

  rerender(events) {
    this._events = events;
    super.rerender(this._events);
  }

  recoveryListeners() {}
}
