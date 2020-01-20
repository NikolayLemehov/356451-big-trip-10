const EURO_SYMBOL = `\u20AC`;
const MenuName = {
  TABLE: `Table`,
  STATS: `Stats`,
};
const menuNames = Object.values(MenuName);
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
const getRandomIntegerNumber = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
const TimePeriodInMinute = {
  MIN: 10,
  MAX: 60 * 12,
};
const getDate = (date) => {
  return {
    start: new Date(date.setMinutes(date.getMinutes() + getRandomIntegerNumber(TimePeriodInMinute.MIN, TimePeriodInMinute.MAX))),
    end: new Date(date.setMinutes(date.getMinutes() + getRandomIntegerNumber(TimePeriodInMinute.MIN, TimePeriodInMinute.MAX))),
  };
};
const EmptyEvent = {
  id: `new`,
  type: `bus`,
  destination: {
    city: ``,
    description: ``,
    photos: [],
  },
  date: getDate(new Date()),
  price: null,
  offers: [],
  isFavorite: false,
  isNewEvent: true,
};
const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};
const Statistic = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME_SPEND: `time-spend`,
};

const GroupType = {
  TRANSFER: `Transfer`,
  ACTIVITY: `Activity`,
};
const groupTypeToPreposition = new Map([
  [GroupType.TRANSFER, `to`],
  [GroupType.ACTIVITY, `in`],
]);
const groupToTypes = new Map([
  [GroupType.TRANSFER, [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`]],
  [GroupType.ACTIVITY, [`check-in`, `restaurant`, `sightseeing`]],
]);
const typeToGroup = new Map();
groupToTypes.forEach((value, key) => value.forEach((type) => typeToGroup.set(type, key)));

export {EURO_SYMBOL, MenuName, menuNames, MILLISECONDS_PER_DAY,
  SortType, FilterType, EmptyEvent, Mode, Statistic,
  GroupType, groupToTypes, groupTypeToPreposition, typeToGroup};
