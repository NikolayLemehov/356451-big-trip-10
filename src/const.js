import {getDate} from "./mock/events";

const menuNames = [`Table`, `Stats`];
const MONTHS = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];
const MILLISECONDS_PER_DAY = 86400000;
const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};
const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};
const EmptyEvent = {
  id: `new`,
  type: `bus`,
  city: `Geneva`,
  photos: [],
  destination: ``,
  date: getDate(new Date()),
  price: ``,
  offers: [],
  isFavorite: false,
  isNewEvent: true,
};

export {menuNames, MONTHS, MILLISECONDS_PER_DAY, SortType, FilterType, EmptyEvent};
