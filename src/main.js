import {createSiteMenuTemplate} from "./components/site-menu";
import {createFiltersTemplate} from "./components/filter";
import {createTripDaysTemplate} from "./components/trip-days";
import {createEventsListTemplate} from "./components/events-list";
import {createEventTemplate} from "./components/event";
import {createEditEventTemplate} from "./components/event-edit";
import {createTripInfoTemplate} from "./components/trip-info";
import {generateEvents} from "./mock/event";
import {filterToChecked, menuNames} from "./const";

const EVENT_COUNT = 6;
const events = generateEvents(EVENT_COUNT);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const titleMenuElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(1)`);
const titleFilterElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(2)`);

render(titleMenuElement, createSiteMenuTemplate(menuNames), `afterend`);
render(titleFilterElement, createFiltersTemplate(filterToChecked), `afterend`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoElement, createTripInfoTemplate(events));

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, createEditEventTemplate(events[0]));
render(tripEventsElement, createTripDaysTemplate());

const tripDaysItemElement = tripEventsElement.querySelector(`.trip-days__item`);

render(tripDaysItemElement, createEventsListTemplate());

const eventListElement = tripDaysItemElement.querySelector(`.trip-events__list`);

events.forEach((event) => render(eventListElement, createEventTemplate(event)));
