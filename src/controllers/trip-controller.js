import EventComponent from "../components/event-component";
import EventEditComponent from "../components/event-edit-component";
import EmptyComponent from "../components/empty-component";
import TripInfoMainComponent from "../components/trip-info-main-component";
import TripDaysComponent from "../components/trip-days-component";
import TripEventsListComponent from "../components/trip-events-list-component";
import TripSortComponent from "../components/trip-sort-component";
import DayInfoComponent from "../components/day-info-component";
import TripDaysItemComponent from "../components/trip-days-item-component";
import {renderElement, RenderPosition} from "../utils/render";
import {formatDate, getExactDate} from "../utils/common";
import {MILLISECONDS_PER_DAY} from "../const";

export default class TripController {
  constructor(container, events, tripInfoElement) {
    this._events = events;
    this._container = container;
    this._tripInfoElement = tripInfoElement;
  }

  render() {
    if (this._events.length === 0) {
      renderElement(this._container, new EmptyComponent());
      return;
    }
    const getEventDays = (events) => {
      const days = [[]];
      let currentDate = getExactDate(events[0].date.start);
      events.forEach((event) => {
        if (formatDate(currentDate) === formatDate(event.date.start)) {
          days[days.length - 1].push(event);
        } else {
          currentDate = getExactDate(event.date.start);
          days.push([]);
          days[days.length - 1].push(event);
        }
      });
      return days;
    };
    const tripDays = getEventDays(this._events);
    let storageDay = 0;
    const dayCounts = tripDays.map((dayEvents, i) => {
      storageDay += i === 0 ? 1 : (getExactDate(dayEvents[0].date.start) - getExactDate(tripDays[i - 1][0].date.start)) / MILLISECONDS_PER_DAY;
      return storageDay;
    });
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

    renderElement(this._container, new TripSortComponent());
    const tripDaysComponent = new TripDaysComponent();
    renderElement(this._container, tripDaysComponent);


    renderElement(this._tripInfoElement, new TripInfoMainComponent(this._events), RenderPosition.AFTERBEGIN);

    tripDays.forEach((dayEvents, i) => {
      const tripDaysItemComponent = new TripDaysItemComponent();
      renderElement(tripDaysComponent.getElement(), tripDaysItemComponent);
      renderElement(tripDaysItemComponent.getElement(), new DayInfoComponent(dayEvents[0].date.start, dayCounts[i]));
      const tripEventsListComponent = new TripEventsListComponent();
      renderElement(tripDaysItemComponent.getElement(), tripEventsListComponent);
      dayEvents.forEach((event) => renderEvent(tripEventsListComponent.getElement(), event));
    });
  }
}
