import {FilterType} from "../const";

const getFutureEvents = (events, date) => {
  return events.filter((it) => it.date.start > date);
};

const getPastEvents = (events, date) => {
  return events.filter((it) => it.date.start <= date);
};

const getEventsByFilter = (events, filterType) => {
  const nowDate = new Date();
  switch (filterType) {
    case FilterType.EVERYTHING:
      return events;
    case FilterType.FUTURE:
      return getFutureEvents(events, nowDate);
    case FilterType.PAST:
      return getPastEvents(events, nowDate);
  }
  return false;
};

export {getEventsByFilter};
