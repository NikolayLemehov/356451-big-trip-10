const getCities = (events) => {
  const cities = events.map((event) => event.city);
  for (let i = cities.length - 1; i > 0; i--) {
    if (cities[i] === cities[i - 1]) {
      cities.splice(i, 1);
    }
  }
  return cities;
};
const createTripInfoTemplate = (events) => {
  const cities = getCities(events);
  const startCity = cities[0];
  const endCity = cities[cities.length - 1];
  const middleCity = cities.length > 3 ? `...` : cities[1];
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${startCity} &mdash; ${middleCity} &mdash; ${endCity}</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
    </div>`
  );
};

export {createTripInfoTemplate};
