import {getDate} from "./mock/events";

const MenuName = {
  TABLE: `Table`,
  STATS: `Stats`,
};
const menuNames = Object.values(MenuName);
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
const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export {MenuName, menuNames, MONTHS, MILLISECONDS_PER_DAY, SortType, FilterType, EmptyEvent, Mode};
