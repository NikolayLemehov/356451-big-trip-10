import EmptyComponent from "../components/empty-component";
import TripInfoMainComponent from "../components/trip-info-main-component";
import TripDaysComponent from "../components/trip-days-component";
import TripEventsListComponent from "../components/trip-events-list-component";
import TripSortComponent from "../components/trip-sort-component";
import DayInfoComponent from "../components/day-info-component";
import TripDaysItemComponent from "../components/trip-days-item-component";
import PointController, {Mode} from "./point-controller";
import {renderElement, RenderPosition} from "../utils/render";
import {formatDate, getExactDate} from "../utils/common";
import {EmptyEvent, MILLISECONDS_PER_DAY, SortType} from "../const";

export default class TripController {
  constructor(container, tripInfoElement, eventsModel) {
    this._container = container;
    this._tripInfoElement = tripInfoElement;
    this._eventsModel = eventsModel;

    this._pointControllers = [];

    this._tripSortComponent = new TripSortComponent(this._eventsModel.getSorts());
    this._tripDaysComponent = new TripDaysComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._tripSortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._eventsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const events = this._eventsModel.getEventsByFilter();
    if (events.length === 0) {
      renderElement(this._container, new EmptyComponent());
      return;
    }

    renderElement(this._container, this._tripSortComponent);
    renderElement(this._container, this._tripDaysComponent);


    renderElement(this._tripInfoElement, new TripInfoMainComponent(events), RenderPosition.AFTERBEGIN);

    this._renderEvents();
  }

  createEvent() {
    if (this._creatingEventController) {
      return;
    }

    this._onViewChange();
    this._creatingEventController = new PointController(document.querySelector(`.trip-events__trip-sort`), this._onDataChange, this._onViewChange);
    this._creatingEventController.render(EmptyEvent, Mode.ADDING);
  }

  _onSortTypeChange(sortType) {
    this._eventsModel.setSortType(sortType);
    this._updateEvents();
  }

  _renderEvents() {
    const events = this._eventsModel.getEventsByFilter();
    this._tripDaysComponent.getElement().innerHTML = ``;
    switch (this._eventsModel.getSortType()) {
      case SortType.EVENT:
        this._renderTripDays(events);
        break;
      case SortType.TIME:
        this._renderSortTrip(events.slice().sort((a, b) => (b.date.end - b.date.start) - (a.date.end - a.date.start)));
        break;
      case SortType.PRICE:
        this._renderSortTrip(events.slice().sort((a, b) => b.price - a.price));
        break;
    }
  }

  _renderSortTrip(sortedEvents) {
    this._pointControllers = this._renderStructure(sortedEvents);
  }

  _renderTripDays(events) {
    if (events.length === 0) {
      return;
    }
    const tripDays = this._getTripDays(events);
    let storageDay = 0;
    const dayCounts = tripDays.map((dayEvents, i) => {
      storageDay += i === 0 ? 1 : (getExactDate(dayEvents[0].date.start) - getExactDate(tripDays[i - 1][0].date.start)) / MILLISECONDS_PER_DAY;
      return storageDay;
    });

    this._pointControllers = tripDays.reduce((acc, dayEvents, i) => {
      return acc.concat(this._renderStructure(dayEvents, dayEvents[0].date.start, dayCounts[i]));
    }, []);
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

    return this._renderOneDayEvents(tripEventsListComponent.getElement(), events);
  }

  _renderOneDayEvents(container, events) {
    return events.map((event) => {
      const pointController = new PointController(container, this._onDataChange, this._onViewChange);
      pointController.render(event, Mode.DEFAULT);
      return pointController;
    });
  }

  _removeTripControllers() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._tripDaysComponent.getElement().innerHTML = ``;
  }

  _updateEvents() {
    this._removeTripControllers();
    this._renderEvents();
  }

  _onDataChange(pointController, oldEvent, newEvent) {
    if (oldEvent === EmptyEvent) {
      this._creatingEventController = null;
      if (newEvent === null) {
        pointController.destroy();
      } else {
        this._eventsModel.addEvent(newEvent);
        pointController.render(newEvent, Mode.DEFAULT);

        const destroyedPointController = this._pointControllers.pop();
        destroyedPointController.destroy();

        this._pointControllers = [].concat(this._pointControllers, pointController);
      }
      this._updateEvents();
    } else if (newEvent === null) {
      this._eventsModel.removeEvent(oldEvent.id);
      this._updateEvents();
    } else {
      const isSuccess = this._eventsModel.updateEvent(oldEvent.id, newEvent);
      if (isSuccess) {
        pointController.render(newEvent, Mode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateEvents();
  }
}
