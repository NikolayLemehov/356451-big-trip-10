import {FilterType} from "../const";

export default class EventsModel {
  constructor() {
    this._events = [];
    this._activeFilterType = FilterType.EVERYTHING;
  }

  getEvents() {
    return this._events;
  }

  setEvents(events) {
    this._events = Array.from(events);
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
        return this._events;
      case FilterType.FUTURE:
        return this._events.filter((it) => it.date.start > nowDate);
      case FilterType.PAST:
        return this._events.filter((it) => it.date.start <= nowDate);
    }
    return false;
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
  }
}
