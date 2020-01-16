import {FilterType, SortType} from "../const";

export default class EventsModel {
  constructor() {
    this._events = [];
    this._activeFilterType = FilterType.EVERYTHING;
    this._activeSortType = SortType.EVENT;

    this._filterChangeHandlers = [];
  }

  setEvents(events) {
    this._events = Array.from(events);
  }

  getEvents() {
    return this._events.slice();
  }

  updateEvent(id, event) {
    const index = this._events.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._events = [].concat(this._events.slice(0, index), event, this._events.slice(index + 1));

    return true;
  }

  getEventsByFilter() {
    const nowDate = new Date();
    switch (this._activeFilterType) {
      case FilterType.EVERYTHING:
        return this._events.slice().sort((a, b) => a.date.start - b.date.start);
      case FilterType.FUTURE:
        return this._events.filter((it) => it.date.start > nowDate);
      case FilterType.PAST:
        return this._events.filter((it) => it.date.start <= nowDate);
    }
    return false;
  }

  removeEvent(id) {
    return this.updateEvent(id, []);
  }

  addEvent(event) {
    this._events = [].concat(event, this._events);
  }

  getFilters() {
    return Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType,
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

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
