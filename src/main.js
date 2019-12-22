import SiteMenuComponent from "./components/site-menu-component";
import FilterListComponent from "./components/filter-list-component";
import TripDayListComponent from "./components/trip-day-list-component";
import EventsListComponent from "./components/events-list-component";
import EventComponent from "./components/event-component";
import EventEditComponent from "./components/event-edit-component";
import TripInfoMainComponent from "./components/trip-info-main-component";
import TripInfoCostComponent from "./components/trip-info-cost-component";
import EmptyComponent from "./components/empty-component";
import {generateEvents} from "./mock/events";
import {filterToChecked, menuNames} from "./const";
import {renderElement, RenderPosition} from "./utils/render";

const EVENT_COUNT = 7;
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

  renderElement(eventListElement, eventComponent);
};

const tripMainElement = document.querySelector(`.trip-main`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
renderElement(tripInfoElement, new TripInfoCostComponent(events));

const titleMenuElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(1)`);
const titleFilterElement = tripMainElement.querySelector(`.trip-controls h2:nth-of-type(2)`);
renderElement(titleMenuElement, new SiteMenuComponent(menuNames), RenderPosition.AFTEREND);
renderElement(titleFilterElement, new FilterListComponent(filterToChecked), RenderPosition.AFTEREND);

const tripEventsElement = document.querySelector(`.trip-events`);

renderElement(tripEventsElement, new TripDayListComponent());
const tripDaysItemElement = tripEventsElement.querySelector(`.trip-days__item`);

const eventListComponent = new EventsListComponent();
renderElement(tripDaysItemElement, eventListComponent);

if (events.length === 0) {
  renderElement(tripEventsElement, new EmptyComponent());
} else {
  renderElement(tripInfoElement, new TripInfoMainComponent(events), RenderPosition.AFTERBEGIN);

  events.forEach((event) => renderEvent(eventListComponent.getElement(), event));
}
