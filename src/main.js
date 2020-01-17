import SiteMenuTitleComponent from "./components/site-menu-title-component";
import SiteMenuComponent from "./components/site-menu-component";
import TripInfoCostComponent from "./components/trip-info-cost-component";
import TripMainEventAddBtnComponent from "./components/trip-main-event-add-btn-component";
import TripEventsComponent from "./components/trip-events-component";
import StatisticsComponent from "./components/statitstics-component";
import TripController from "./controllers/trip-controller";
import FilterController from "./controllers/filter-controller";
import {generateEvents} from "./mock/events";
import {MenuName, menuNames} from "./const";
import {renderElement} from "./utils/render";
import EventsModel from "./models/events-model";
import 'flatpickr/dist/flatpickr.css';

const EVENT_COUNT = 15;
const events = generateEvents(EVENT_COUNT);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const tripMainElement = document.querySelector(`.trip-main`);

const tripMainEventAddBtnComponent = new TripMainEventAddBtnComponent();
renderElement(tripMainElement, tripMainEventAddBtnComponent);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
renderElement(tripInfoElement, new TripInfoCostComponent(events));

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

const siteMenuTitleComponent = new SiteMenuTitleComponent();
const siteMenuComponent = new SiteMenuComponent(menuNames);
renderElement(tripControlsElement, siteMenuTitleComponent);
renderElement(tripControlsElement, siteMenuComponent);

const filterController = new FilterController(tripControlsElement, eventsModel);
filterController.render();

const pageBodyContainerElement = document.querySelector(`.page-body__page-main .page-body__container`);
const tripEventsComponent = new TripEventsComponent();
const statisticsComponent = new StatisticsComponent(eventsModel);
renderElement(pageBodyContainerElement, tripEventsComponent);
renderElement(pageBodyContainerElement, statisticsComponent);

const tripController = new TripController(tripEventsComponent, tripInfoElement, eventsModel);
tripController.render();
statisticsComponent.hide();

tripMainEventAddBtnComponent.setAddButtonClickHandler(() => {
  tripController.createEvent();
});

siteMenuComponent.setChangeHandler((menuName) => {
  switch (menuName) {
    case MenuName.TABLE:
      statisticsComponent.hide();
      pageBodyContainerElement.classList.remove(`disable-line`);
      tripController.show();
      filterController.show();
      break;
    case MenuName.STATS:
      tripController.hide();
      pageBodyContainerElement.classList.add(`disable-line`);
      filterController.hide();
      statisticsComponent.show();
  }
});
