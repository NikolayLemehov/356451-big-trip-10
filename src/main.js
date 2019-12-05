import {createSiteMenuTemplate} from "./components/site-menu";
import {createFilterTemplate} from "./components/filter";
import {createTripDaysTemplate} from "./components/trip-days";
import {createEventsListTemplate} from "./components/events-list";
import {createEventsItemTemplate} from "./components/event";
import {createFormEditTemplate} from "./components/event-edit";
import {createTripInfoTemplate} from "./components/trip-info";
import {generateEvents} from "./mock/event";

const EVENT_COUNT = 6;
const events = generateEvents(EVENT_COUNT);
// console.log(events);
// events.forEach((it) => {
//   console.log(it.type);
//   console.log(it.offers);
// });
// events.forEach((it) => console.log(it.offers));

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const titleMenuElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(1)`);
const titleFilterElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(2)`);

render(titleMenuElement, createSiteMenuTemplate(), `afterend`);
render(titleFilterElement, createFilterTemplate(), `afterend`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripInfoTemplate(), `afterbegin`);

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, createFormEditTemplate());
render(tripEventsElement, createTripDaysTemplate());

const tripDaysItemElement = tripEventsElement.querySelector(`.trip-days__item`);

render(tripDaysItemElement, createEventsListTemplate());

const eventListElement = tripDaysItemElement.querySelector(`.trip-events__list`);

new Array(EVENT_COUNT)
  .fill(``)
  .forEach(() => render(eventListElement, createEventsItemTemplate()));

