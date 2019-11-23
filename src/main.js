import {createSiteMenuTemplate} from "./components/site-menu";
import {createFilterTemplate} from "./components/filter";
import {createTripDaysTemplate} from "./components/trip-days";
import {createEventsListTemplate} from "./components/evets-list";
import {createEventsItemTemplate} from "./components/events-item";
import {createFormEditTemplate} from "./components/form-edit";
import {createTripInfoTemplate} from "./components/trip-info";

const EVENT_COUNT = 3;

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

