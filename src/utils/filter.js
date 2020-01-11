import {FilterType} from "../const";

const getFutureEvents = (events) => {
  return events;
};

const getPastEvents = (events) => {
  return events;
};

const getEventsByFilter = (events, filterType) => {
  switch (filterType) {
    case FilterType.EVERYTHING:
      return events;
    case FilterType.FUTURE:
      return getFutureEvents(events);
    case FilterType.PAST:
      return getPastEvents(events);
  }
  return false;
};

export {getEventsByFilter};
