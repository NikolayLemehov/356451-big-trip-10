import SiteMenuComponent from "./components/site-menu-component";
import TripInfoCostComponent from "./components/trip-info-cost-component";
import TripController from "./controllers/trip-controller";
import FilterController from "./controllers/filter-controller";
import {generateEvents} from "./mock/events";
import {menuNames} from "./const";
import {renderElement, RenderPosition} from "./utils/render";
import EventsModel from "./models/events-model";
import 'flatpickr/dist/flatpickr.css';
import TripMainEventAddBtnComponent from "./components/trip-main-event-add-btn-component";

const EVENT_COUNT = 10;
const events = generateEvents(EVENT_COUNT);

const tripMainElement = document.querySelector(`.trip-main`);

const tripMainEventAddBtnComponent = new TripMainEventAddBtnComponent();
renderElement(tripMainElement, tripMainEventAddBtnComponent);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
renderElement(tripInfoElement, new TripInfoCostComponent(events));

const titleMenuElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(1)`);
renderElement(titleMenuElement, new SiteMenuComponent(menuNames), RenderPosition.AFTEREND);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const titleFilterElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(2)`);
const filterController = new FilterController(titleFilterElement, eventsModel);
filterController.render();


const tripEventsElement = document.querySelector(`.trip-events`);
const tripController = new TripController(tripEventsElement, tripInfoElement, eventsModel);
tripController.render();

tripMainEventAddBtnComponent.setAddButtonClickHandler(() => {
  tripController.createEvent();
});
