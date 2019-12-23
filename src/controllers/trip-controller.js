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
import {MILLISECONDS_PER_DAY, SortType} from "../const";

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
    const getTripDays = (events) => {
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
    const tripDays = getTripDays(this._events);
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

    const tripSortComponent = new TripSortComponent();
    renderElement(this._container, tripSortComponent);
    const tripDaysComponent = new TripDaysComponent();
    renderElement(this._container, tripDaysComponent);


    renderElement(this._tripInfoElement, new TripInfoMainComponent(this._events), RenderPosition.AFTERBEGIN);

    const renderTripDays = () => {
      tripDays.forEach((dayEvents, i) => {
        const tripDaysItemComponent = new TripDaysItemComponent();
        renderElement(tripDaysComponent.getElement(), tripDaysItemComponent);
        const isEmpty = false;
        renderElement(tripDaysItemComponent.getElement(), new DayInfoComponent(isEmpty, dayEvents[0].date.start, dayCounts[i]));
        const tripEventsListComponent = new TripEventsListComponent();
        renderElement(tripDaysItemComponent.getElement(), tripEventsListComponent);
        dayEvents.forEach((event) => renderEvent(tripEventsListComponent.getElement(), event));
      });
    };

    const renderSortTrip = (sortedEvents) => {
      const tripDaysItemComponent = new TripDaysItemComponent();
      renderElement(tripDaysComponent.getElement(), tripDaysItemComponent);
      const isEmpty = true;
      renderElement(tripDaysItemComponent.getElement(), new DayInfoComponent(isEmpty));
      const tripEventsListComponent = new TripEventsListComponent();
      renderElement(tripDaysItemComponent.getElement(), tripEventsListComponent);
      sortedEvents.forEach((event) => renderEvent(tripEventsListComponent.getElement(), event));
    };

    renderTripDays();
    tripSortComponent.setSortTypeChangeHandler((sortType) => {
      tripDaysComponent.getElement().innerHTML = ``;
      switch (sortType) {
        case SortType.EVENT:
          renderTripDays();
          break;
        case SortType.TIME:
          renderSortTrip(this._events.slice().sort((a, b) => (a.date.end - a.date.start) - (b.date.end - b.date.start)));
          break;
        case SortType.PRICE:
          renderSortTrip(this._events.slice().sort((a, b) => a.price - b.price));
          break;
      }
    });
  }
}
