import SiteMenuComponent from "./components/site-menu-component";
import FilterListComponent from "./components/filter-list-component";
import TripInfoCostComponent from "./components/trip-info-cost-component";
import TripController from "./controllers/trip-controller";
import {generateEvents} from "./mock/events";
import {filterToChecked, menuNames} from "./const";
import {renderElement, RenderPosition} from "./utils/render";
import EventsModel from "./models/events-model";
import 'flatpickr/dist/flatpickr.css';

const EVENT_COUNT = 8;
const events = generateEvents(EVENT_COUNT);

const tripMainElement = document.querySelector(`.trip-main`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
renderElement(tripInfoElement, new TripInfoCostComponent(events));

const titleMenuElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(1)`);
const titleFilterElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(2)`);
renderElement(titleMenuElement, new SiteMenuComponent(menuNames), RenderPosition.AFTEREND);
renderElement(titleFilterElement, new FilterListComponent(filterToChecked), RenderPosition.AFTEREND);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsElement, tripInfoElement, eventsModel);
tripController.render();
