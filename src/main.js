import SiteMenuComponent from "./components/site-menu";
import FiltersComponent from "./components/filter";
import TripDaysComponent from "./components/trip-days";
import EventsListComponent from "./components/events-list";
import EventComponent from "./components/event";
import EditEventComponent from "./components/event-edit";
import TripInfoComponent from "./components/trip-info";
import {generateEvents} from "./mock/events";
import {filterToChecked, menuNames} from "./const";
import {render, RenderPosition} from "./utils";

const EVENT_COUNT = 6;
const events = generateEvents(EVENT_COUNT);

const tripMainElement = document.querySelector(`.trip-main`);
const titleMenuElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(1)`);
const titleFilterElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(2)`);

render(titleMenuElement, new SiteMenuComponent(menuNames).getElement(), RenderPosition.AFTEREND);
render(titleFilterElement, new FiltersComponent(filterToChecked).getElement(), RenderPosition.AFTEREND);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

render(tripInfoElement, new TripInfoComponent(events).getElement());

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, new EditEventComponent(events[0]).getElement());
render(tripEventsElement, new TripDaysComponent().getElement());

const tripDaysItemElement = tripEventsElement.querySelector(`.trip-days__item`);

render(tripDaysItemElement, new EventsListComponent().getElement());

const eventListElement = tripDaysItemElement.querySelector(`.trip-events__list`);

events.forEach((event) => render(eventListElement, new EventComponent(event).getElement()));
