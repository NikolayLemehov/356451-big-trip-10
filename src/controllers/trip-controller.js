import EmptyComponent from '../components/empty-component';
import TripInfoMainComponent from '../components/trip-info-main-component';
import TripInfoCostComponent from '../components/trip-info-cost-component';
import TripDaysComponent from '../components/trip-days-component';
import TripEventsListComponent from '../components/trip-events-list-component';
import TripSortComponent from '../components/trip-sort-component';
import DayInfoComponent from '../components/day-info-component';
import TripDaysItemComponent from '../components/trip-days-item-component';
import PointController from './point-controller';
import EventAdapterModel from '../models/event-adapter-model';
import {renderElement, RenderPosition} from '../utils/render';
import {formatDate, getExactDate} from '../utils/common';
import {EmptyEvent, MILLISECONDS_PER_DAY, Mode, SortType} from '../const';

export default class TripController {
  constructor(containerComponent, tripInfoElement, eventsModel, api) {
    this._containerComponent = containerComponent;
    this._container = containerComponent.getElement();
    this._tripInfoElement = tripInfoElement;
    this._eventsModel = eventsModel;
    this._api = api;

    this._pointControllers = [];
    this._creatingEventController = null;
    this._backEndStaticData = {
      destinations: [],
      typeToOffers: new Map(),
    };
    this._tripInfoMainComponent = null;
    this._tripInfoCostComponent = null;
    this._tripMainEventAddBtnComponent = null;

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
    this._backEndStaticData.destinations = this._eventsModel.getDestinations();
    this._backEndStaticData.typeToOffers = this._eventsModel.getTypeToOffers();

    const eventAdapterModels = this._eventsModel.getEventsByFilter();
    if (eventAdapterModels.length === 0) {
      renderElement(this._container, new EmptyComponent());
      return;
    }

    renderElement(this._container, this._tripSortComponent);
    renderElement(this._container, this._tripDaysComponent);

    this._tripInfoMainComponent = new TripInfoMainComponent(this._eventsModel.getSortingDateEvents());
    this._tripInfoCostComponent = new TripInfoCostComponent(this._eventsModel.getSortingDateEvents());
    renderElement(this._tripInfoElement, this._tripInfoMainComponent, RenderPosition.AFTERBEGIN);
    renderElement(this._tripInfoElement, this._tripInfoCostComponent);

    this._renderEvents();
  }

  createEvent(tripMainEventAddBtnComponent) {
    this._tripMainEventAddBtnComponent = tripMainEventAddBtnComponent;
    if (this._creatingEventController) {
      return;
    }

    this._onViewChange();
    this._creatingEventController = new PointController(document.querySelector(`.trip-events__trip-sort`), this._onDataChange, this._onViewChange);
    this._creatingEventController.render(EmptyEvent, Mode.ADDING, this._backEndStaticData);
  }

  hide() {
    this._containerComponent.hide();
  }

  show() {
    this._containerComponent.show();
  }

  _onSortTypeChange(sortType) {
    this._eventsModel.setSortType(sortType);
    this._updateEvents();
  }

  _renderEvents() {
    const eventAdapterModels = this._eventsModel.getEventsByFilter();
    this._tripDaysComponent.getElement().innerHTML = ``;
    switch (this._eventsModel.getSortType()) {
      case SortType.EVENT:
        this._renderTripDays(eventAdapterModels);
        break;
      case SortType.TIME:
        this._renderSortTrip(eventAdapterModels.slice().sort((a, b) => (b.date.end - b.date.start) - (a.date.end - a.date.start)));
        break;
      case SortType.PRICE:
        this._renderSortTrip(eventAdapterModels.slice().sort((a, b) => b.price - a.price));
        break;
    }
  }

  _renderSortTrip(sortedEventAdapterModels) {
    this._pointControllers = this._renderStructure(sortedEventAdapterModels);
  }

  _renderTripDays(eventAdapterModels) {
    if (eventAdapterModels.length === 0) {
      return;
    }

    const tripDays = this._getTripDays(eventAdapterModels);
    let storageDay = 0;
    const dayCounts = tripDays.map((dayEvents, i) => {
      storageDay += i === 0 ? 1 : (getExactDate(dayEvents[0].date.start) - getExactDate(tripDays[i - 1][0].date.start)) / MILLISECONDS_PER_DAY;
      return storageDay;
    });

    this._pointControllers = tripDays.reduce((acc, dayEvents, i) => {
      return acc.concat(this._renderStructure(dayEvents, dayEvents[0].date.start, dayCounts[i]));
    }, []);
  }

  _getTripDays(eventAdapterModels) {
    const days = [[]];
    let currentDate = getExactDate(eventAdapterModels[0].date.start);
    eventAdapterModels.forEach((event) => {
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

  _renderStructure(eventAdapterModels, date, dayCount) {
    const tripDaysItemComponent = new TripDaysItemComponent();
    renderElement(this._tripDaysComponent.getElement(), tripDaysItemComponent);
    renderElement(tripDaysItemComponent.getElement(), new DayInfoComponent(date, dayCount));
    const tripEventsListComponent = new TripEventsListComponent();
    renderElement(tripDaysItemComponent.getElement(), tripEventsListComponent);

    return this._renderOneDayEvents(tripEventsListComponent.getElement(), eventAdapterModels);
  }

  _renderOneDayEvents(container, eventAdapterModels) {
    return eventAdapterModels.map((eventAdapterModel) => {
      const pointController = new PointController(container, this._onDataChange, this._onViewChange);
      pointController.render(eventAdapterModel, Mode.DEFAULT, this._backEndStaticData);
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
    this._tripInfoMainComponent.rerender(this._eventsModel.getSortingDateEvents());
    this._tripInfoCostComponent.rerender(this._eventsModel.getSortingDateEvents());
  }

  _onDataChange(pointController, oldEvent, newEventAdapterModel, isDoUpdateEvents = true) {
    if (oldEvent === EmptyEvent) {
      this._creatingEventController = null;
      this._tripMainEventAddBtnComponent.activeBtn();
      if (newEventAdapterModel === null) {
        pointController.destroy();
      } else {
        this._api.createPoint(newEventAdapterModel)
          .then((eventAdapterModel) => {
            const typeToOffers = this._eventsModel.getTypeToOffers();
            eventAdapterModel = EventAdapterModel.replenishOffers(typeToOffers.get(eventAdapterModel.type), eventAdapterModel);
            this._eventsModel.addEvent(eventAdapterModel);
            pointController.render(eventAdapterModel, Mode.DEFAULT, this._backEndStaticData);

            const destroyedPointController = this._pointControllers.pop();
            destroyedPointController.destroy();

            this._pointControllers = [].concat(this._pointControllers, pointController);
            this._updateEvents();
          })
          .catch(() => {
            pointController.shake();
          });
      }
      this._updateEvents();
    } else if (newEventAdapterModel === null) {
      this._api.deletePoint(oldEvent.id)
        .then(() => {
          this._eventsModel.removeEvent(oldEvent.id);
          this._updateEvents();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updatePoint(oldEvent.id, newEventAdapterModel)
        .then((eventAdapterModel) => {
          const typeToOffers = this._eventsModel.getTypeToOffers();
          eventAdapterModel = EventAdapterModel.replenishOffers(typeToOffers.get(eventAdapterModel.type), eventAdapterModel);
          const isSuccess = this._eventsModel.updateEvent(oldEvent.id, eventAdapterModel);
          if (isSuccess) {
            pointController.render(eventAdapterModel, Mode.DEFAULT, this._backEndStaticData);
            if (isDoUpdateEvents) {
              this._updateEvents();
            }
          }
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onViewChange() {
    if (this._tripMainEventAddBtnComponent) {
      this._tripMainEventAddBtnComponent.activeBtn();
    }
    if (this._creatingEventController) {
      this._creatingEventController.destroy();
      this._creatingEventController = null;
    }
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateEvents();
  }
}
