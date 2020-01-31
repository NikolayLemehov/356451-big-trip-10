import Index from './api';
import SiteMenuTitleComponent from './components/site-menu-title-component';
import SiteMenuComponent from './components/site-menu-component';
import TripMainEventAddBtnComponent from './components/trip-main-event-add-btn-component';
import TripEventsComponent from './components/trip-events-component';
import StatisticsComponent from './components/statitstics-component';
import TripController from './controllers/trip-controller';
import FilterController from './controllers/filter-controller';
import {MenuName, menuNames} from './const';
import {renderElement} from './utils/render';
import EventsModel from './models/events-model';
import EventAdapterModel from './models/event-adapter-model';
import Store from './api/store';
import Provider from './api/provider';
import 'flatpickr/dist/flatpickr.css';

const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const AUTHORIZATION = `Basic 6PZAz5uh8iB4RIAL336Xr`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;
let typeToOffers = new Map();

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      document.title += `[SW]`;
    })
    .catch(() => {
      document.title += `[no SW]`;
    });
});

const api = new Index(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const eventsModel = new EventsModel();

const tripMainElement = document.querySelector(`.trip-main`);

const tripMainEventAddBtnComponent = new TripMainEventAddBtnComponent();
renderElement(tripMainElement, tripMainEventAddBtnComponent);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

const siteMenuTitleComponent = new SiteMenuTitleComponent();
const siteMenuComponent = new SiteMenuComponent(menuNames);
renderElement(tripControlsElement, siteMenuTitleComponent);
renderElement(tripControlsElement, siteMenuComponent);

const filterController = new FilterController(tripControlsElement, eventsModel);

const pageBodyContainerElement = document.querySelector(`.page-body__page-main .page-body__container`);
const tripEventsComponent = new TripEventsComponent();
const statisticsComponent = new StatisticsComponent(eventsModel);
renderElement(pageBodyContainerElement, tripEventsComponent);
renderElement(pageBodyContainerElement, statisticsComponent);

const tripController = new TripController(tripEventsComponent, tripInfoElement, eventsModel, apiWithProvider);
statisticsComponent.hide();

tripMainEventAddBtnComponent.setAddButtonClickHandler(() => {
  tripController.createEvent(tripMainEventAddBtnComponent);
  tripMainEventAddBtnComponent.disableBtn();
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

Promise.all([
  apiWithProvider.getOffers().then((offerAdapterModel) => offerAdapterModel),
  apiWithProvider.getDestinations().then((destinationAdapterModel) => destinationAdapterModel),
  apiWithProvider.getPoints().then((eventAdapterModels) => eventAdapterModels),
]).then(([offerAdapterModel, destinationAdapterModel, eventAdapterModels]) => {
  eventsModel.setDestinations(destinationAdapterModel.destinations);
  eventsModel.setTypeToOffers(offerAdapterModel.typeToOffers);
  typeToOffers = offerAdapterModel.typeToOffers;
  eventAdapterModels.forEach((it) => {
    EventAdapterModel.replenishOffers(typeToOffers.get(it.type), it);
  });
  eventsModel.setEvents(eventAdapterModels);

  filterController.render();
  tripController.render();
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then((syncedEndEvents) => {
        const eventAdapterModels = syncedEndEvents.map((it) => {
          it = EventAdapterModel.parseEvent(it);
          return EventAdapterModel.replenishOffers(typeToOffers.get(it.type), it);
        });
        eventsModel.setEvents(eventAdapterModels);

        tripController._updateEvents();
      })
      .catch(() => {
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
