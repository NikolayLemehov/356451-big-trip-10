import EmptyComponent from "../components/empty-component";
import TripInfoMainComponent from "../components/trip-info-main-component";
import TripDaysComponent from "../components/trip-days-component";
import TripEventsListComponent from "../components/trip-events-list-component";
import TripSortComponent from "../components/trip-sort-component";
import DayInfoComponent from "../components/day-info-component";
import TripDaysItemComponent from "../components/trip-days-item-component";
import PointController from "./point-controller";
import {renderElement, RenderPosition} from "../utils/render";
import {formatDate, getExactDate} from "../utils/common";
import {MILLISECONDS_PER_DAY, SortType} from "../const";

export default class TripController {
  constructor(container, events, tripInfoElement) {
    this._container = container;
    this._events = events;
    this._tripInfoElement = tripInfoElement;

    this._tripSortComponent = new TripSortComponent();
    this._tripDaysComponent = new TripDaysComponent();
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

    renderElement(this._container, this._tripSortComponent);
    renderElement(this._container, this._tripDaysComponent);


    renderElement(this._tripInfoElement, new TripInfoMainComponent(this._events), RenderPosition.AFTERBEGIN);

    const renderTripDays = () => {
      tripDays.forEach((dayEvents, i) => {
        this._renderStructure(dayEvents, dayEvents[0].date.start, dayCounts[i]);
      });
      this._tripSortComponent.showDate();
    };

    const renderSortTrip = (sortedEvents) => {
      this._renderStructure(sortedEvents);
      this._tripSortComponent.hideDate();
    };

    renderTripDays();
    this._tripSortComponent.setSortTypeChangeHandler((sortType) => {
      this._tripDaysComponent.getElement().innerHTML = ``;
      switch (sortType) {
        case SortType.EVENT:
          renderTripDays();
          break;
        case SortType.TIME:
          renderSortTrip(this._events.slice().sort((a, b) => (b.date.end - b.date.start) - (a.date.end - a.date.start)));
          break;
        case SortType.PRICE:
          renderSortTrip(this._events.slice().sort((a, b) => b.price - a.price));
          break;
      }
    });
  }

  _renderStructure(events, date, dayCount) {
    const tripDaysItemComponent = new TripDaysItemComponent();
    renderElement(this._tripDaysComponent.getElement(), tripDaysItemComponent);
    renderElement(tripDaysItemComponent.getElement(), new DayInfoComponent(date, dayCount));
    const tripEventsListComponent = new TripEventsListComponent();
    renderElement(tripDaysItemComponent.getElement(), tripEventsListComponent);
    this._renderEvents(tripEventsListComponent.getElement(), events);
  }

  _renderEvents(container, events) {
    events.forEach((event) => {
      const pointController = new PointController(container);
      pointController.render(event);
    });
  }
}
