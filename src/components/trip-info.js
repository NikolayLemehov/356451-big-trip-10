import {MONTHS} from "../const";

const getCities = (events) => {
  const cities = events.map((event) => event.city);
  for (let i = cities.length - 1; i > 0; i--) {
    if (cities[i] === cities[i - 1]) {
      cities.splice(i, 1);
    }
  }
  return cities;
};
const getPeriod = (events) => {
  const startDate = new Date(events[0].date.start);
  const endDate = new Date(events[events.length - 1].date.end);

  if (startDate.getMonth() === endDate.getMonth()) {
    return {
      start: `${MONTHS[startDate.getMonth()]} ${startDate.getDate()}`,
      end: `${endDate.getDate()}`,
    };
  } else {
    return {
      start: `${startDate.getDate()} ${MONTHS[startDate.getMonth()]}`,
      end: `${endDate.getDate()} ${MONTHS[endDate.getMonth()]}`,
    };
  }
};

const createTripInfoTemplate = (events) => {
  const cities = getCities(events);
  const startCity = cities[0];
  const endCity = cities[cities.length - 1];
  const middleCity = cities.length > 3 ? `...` : cities[1];
  const date = getPeriod(events);
  const totalCost = events.reduce((total, event) => total + event.price, 0);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${startCity} &mdash; ${middleCity} &mdash; ${endCity}</h1>

      <p class="trip-info__dates">${date.start}&nbsp;&mdash;&nbsp;${date.end}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>`
  );
};

export {createTripInfoTemplate};
