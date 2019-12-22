import EventComponent from "../components/event-component";
import EventEditComponent from "../components/event-edit-component";
import EmptyComponent from "../components/empty-component";
import TripInfoMainComponent from "../components/trip-info-main-component";
import TripDayListComponent from "../components/trip-day-list-component";
import EventsListComponent from "../components/events-list-component";
import {renderElement, RenderPosition} from "../utils/render";

export default class TripController {
  constructor(container, events, tripInfoElement) {
    this._events = events;
    this._container = container;
    this._tripInfoElement = tripInfoElement;
  }

  render() {
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
      eventComponent.setEditButtonClickHandler(() => {
        replaceEventToEdit();
        document.addEventListener(`keydown`, onEscKeyDown);
      });

      const eventEditComponent = new EventEditComponent(event);
      eventEditComponent.getSubmitHandler(replaceEditToEvent);

      renderElement(eventListElement, eventComponent);
    };

    renderElement(this._container, new TripDayListComponent());
    const tripDaysItemElement = this._container.querySelector(`.trip-days__item`);

    const eventListComponent = new EventsListComponent();
    renderElement(tripDaysItemElement, eventListComponent);

    if (this._events.length === 0) {
      renderElement(this._container, new EmptyComponent());
    } else {
      renderElement(this._tripInfoElement, new TripInfoMainComponent(this._events), RenderPosition.AFTERBEGIN);

      this._events.forEach((event) => renderEvent(eventListComponent.getElement(), event));
    }
  }
}
