import SiteMenuComponent from "./components/site-menu";
import FiltersComponent from "./components/filter";
import TripDaysComponent from "./components/trip-days";
import EventsListComponent from "./components/events-list";
import EventComponent from "./components/event";
import EventEditComponent from "./components/event-edit";
import TripInfoMainComponent from "./components/trip-info-main";
import TripInfoCostComponent from "./components/trip-info-cost";
import NoPointsComponent from "./components/no-points";
import {generateEvents} from "./mock/events";
import {filterToChecked, menuNames} from "./const";
import {render, RenderPosition} from "./utils";

const EVENT_COUNT = 6;
const events = generateEvents(EVENT_COUNT);
const renderEvent = (eventListElement, event) => {
  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToEvent = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const replaceEventToEdit = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const eventComponent = new EventComponent(event);
  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);

  editButton.addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const eventEditComponent = new EventEditComponent(event);
  const editForm = eventEditComponent.getElement();

  editForm.addEventListener(`submit`, replaceEditToEvent);

  render(eventListElement, eventComponent.getElement());
};

const tripMainElement = document.querySelector(`.trip-main`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripInfoCostComponent(events).getElement());

const titleMenuElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(1)`);
const titleFilterElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(2)`);
render(titleMenuElement, new SiteMenuComponent(menuNames).getElement(), RenderPosition.AFTEREND);
render(titleFilterElement, new FiltersComponent(filterToChecked).getElement(), RenderPosition.AFTEREND);

const tripEventsElement = document.querySelector(`.trip-events`);

render(tripEventsElement, new TripDaysComponent().getElement());
const tripDaysItemElement = tripEventsElement.querySelector(`.trip-days__item`);

const eventListComponent = new EventsListComponent();
render(tripDaysItemElement, eventListComponent.getElement());

if (events.length === 0) {
  render(tripEventsElement, new NoPointsComponent().getElement());
} else {
  render(tripInfoElement, new TripInfoMainComponent(events).getElement(), RenderPosition.AFTERBEGIN);

  events.forEach((event) => renderEvent(eventListComponent.getElement(), event));
}
