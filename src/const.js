const filterNames = [`everything`, `future`, `past`];
const filterToChecked = new Map(filterNames.map((name, i) => i === 0 ? [name, true] : [name, false]));

const menuNames = [`Table`, `Stats`];
const months = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];

export {menuNames, months, filterToChecked};
