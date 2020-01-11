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
  constructor(container, tripInfoElement, eventsModel) {
    this._container = container;
    this._tripInfoElement = tripInfoElement;
    this._eventsModel = eventsModel;

    this._tripControllers = [];

    this._tripSortComponent = new TripSortComponent();
    this._tripDaysComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._tripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render() {
    const events = this._eventsModel.getEvents();
    if (events.length === 0) {
      renderElement(this._container, new EmptyComponent());
      return;
    }

    renderElement(this._container, this._tripSortComponent);
    renderElement(this._container, this._tripDaysComponent);


    renderElement(this._tripInfoElement, new TripInfoMainComponent(events), RenderPosition.AFTERBEGIN);

    this._renderTripDays();
  }

  _onSortTypeChange(sortType) {
    this._tripDaysComponent.getElement().innerHTML = ``;
    switch (sortType) {
      case SortType.EVENT:
        this._renderTripDays();
        break;
      case SortType.TIME:
        this._renderSortTrip(this._eventsModel.getEvents().slice().sort((a, b) => (b.date.end - b.date.start) - (a.date.end - a.date.start)));
        break;
      case SortType.PRICE:
        this._renderSortTrip(this._eventsModel.getEvents().slice().sort((a, b) => b.price - a.price));
        break;
    }
  }

  _renderSortTrip(sortedEvents) {
    this._tripControllers = this._renderStructure(sortedEvents);
    this._tripSortComponent.hideDate();
  }

  _renderTripDays() {
    const tripDays = this._getTripDays(this._eventsModel.getEvents());
    let storageDay = 0;
    const dayCounts = tripDays.map((dayEvents, i) => {
      storageDay += i === 0 ? 1 : (getExactDate(dayEvents[0].date.start) - getExactDate(tripDays[i - 1][0].date.start)) / MILLISECONDS_PER_DAY;
      return storageDay;
    });

    this._tripControllers = tripDays.reduce((acc, dayEvents, i) => {
      return acc.concat(this._renderStructure(dayEvents, dayEvents[0].date.start, dayCounts[i]));
    }, []);
    this._tripSortComponent.showDate();
  }

  _getTripDays(events) {
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
  }

  _renderStructure(events, date, dayCount) {
    const tripDaysItemComponent = new TripDaysItemComponent();
    renderElement(this._tripDaysComponent.getElement(), tripDaysItemComponent);
    renderElement(tripDaysItemComponent.getElement(), new DayInfoComponent(date, dayCount));
    const tripEventsListComponent = new TripEventsListComponent();
    renderElement(tripDaysItemComponent.getElement(), tripEventsListComponent);

    return this._renderEvents(tripEventsListComponent.getElement(), events, this._onDataChange, this._onViewChange);
  }

  _renderEvents(container, events, onDataChange, onViewChange) {
    return events.map((event) => {
      const pointController = new PointController(container, onDataChange, onViewChange);
      pointController.render(event);
      return pointController;
    });
  }

  _onDataChange(pointController, oldEvent, newEvent) {
    const isSuccess = this._eventsModel.updateEvent(oldEvent.id, newEvent);
    if (isSuccess) {
      pointController.render(newEvent);
    }
  }

  _onViewChange() {
    this._tripControllers.forEach((it) => it.setDefaultView());
  }
}