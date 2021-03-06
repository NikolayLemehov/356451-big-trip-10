import {FilterType, SortType} from '../const';

export default class EventsModel {
  constructor() {
    this._eventAdapterModels = [];
    this._activeFilterType = FilterType.EVERYTHING;
    this._activeSortType = SortType.EVENT;

    this._destinations = [];
    this._typeToOffers = new Map();
    this._filterChangeHandlers = [];
    this._dataChangeHandlers = [];
  }

  setEvents(eventAdapterModels) {
    this._eventAdapterModels = Array.from(eventAdapterModels);
  }

  getEvents() {
    return this._eventAdapterModels.slice();
  }

  updateEvent(id, eventAdapterModel) {
    const index = this._eventAdapterModels.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._eventAdapterModels = [].concat(this._eventAdapterModels.slice(0, index), eventAdapterModel, this._eventAdapterModels.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  getSortingDateEvents() {
    return this._eventAdapterModels.slice().sort((a, b) => a.date.start - b.date.start);
  }

  getEventsByFilter() {
    const nowDate = new Date();
    switch (this._activeFilterType) {
      case FilterType.EVERYTHING:
        return this.getSortingDateEvents();
      case FilterType.FUTURE:
        return this.getSortingDateEvents().filter((it) => it.date.start > nowDate);
      case FilterType.PAST:
        return this.getSortingDateEvents().filter((it) => it.date.start <= nowDate);
    }
    return false;
  }

  removeEvent(id) {
    return this.updateEvent(id, []);
  }

  addEvent(eventAdapterModel) {
    this._eventAdapterModels = [].concat(eventAdapterModel, this._eventAdapterModels);
    this._callHandlers(this._dataChangeHandlers);
  }

  getFilters() {
    const nowDate = new Date();
    return Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType,
        isAvailable: this._getAvailabilityBtnByFilter(filterType, nowDate),
      };
    });
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  getSorts() {
    return Object.values(SortType).map((sortType) => {
      return {
        name: sortType,
        isChecked: sortType === this._activeSortType,
        haveSvg: sortType !== SortType.EVENT,
      };
    });
  }

  getSortType() {
    return this._activeSortType;
  }

  setSortType(sortType) {
    this._activeSortType = sortType;
  }

  getDestinations() {
    return this._destinations.slice();
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getTypeToOffers() {
    return this._typeToOffers;
  }

  setTypeToOffers(typeToOffers) {
    this._typeToOffers = typeToOffers;
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  _getAvailabilityBtnByFilter(filterType, nowDate) {
    switch (filterType) {
      case FilterType.EVERYTHING:
        return this._eventAdapterModels.some((it) => !!it);
      case FilterType.FUTURE:
        return this._eventAdapterModels.some((it) => it.date.start > nowDate);
      case FilterType.PAST:
        return this._eventAdapterModels.some((it) => it.date.start <= nowDate);
    }
    return false;
  }
}
