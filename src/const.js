const filterNames = [`everything`, `future`, `past`];
const filterToChecked = new Map(filterNames.map((name, i) => i === 0 ? [name, true] : [name, false]));

const menuNames = [`Table`, `Stats`];
const MONTHS = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];
const MILLISECONDS_PER_DAY = 86400000;
const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export {menuNames, MONTHS, filterToChecked, MILLISECONDS_PER_DAY, SortType};
