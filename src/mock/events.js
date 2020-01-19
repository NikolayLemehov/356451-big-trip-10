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

const cities = [`Geneva`, `Copenhagen`, `Amsterdam`, `Lisbon`, `Riga`, `Helsinki`, `Dresden`];
const TimePeriodInMinute = {
  MIN: 10,
  MAX: 60 * 12,
};
const offersStructure = {
  luggage: {
    name: `luggage`,
    title: `Add luggage`,
    price: 10,
  },
  comfort: {
    name: `comfort`,
    title: `Switch to comfort class`,
    price: 150,
  },
  meal: {
    name: `meal`,
    title: `Add meal`,
    price: 2,
  },
  seats: {
    name: `seats`,
    title: `Choose seats`,
    price: 9,
  },
  train: {
    name: `train`,
    title: `Travel by train`,
    price: 40,
  },
};
const getOfferNames = () => {
  const names = [];
  for (let key in offersStructure) {
    if (key !== undefined) {
      names.push(offersStructure[key].name);
    }
  }
  return names;
};
const offerNames = getOfferNames();

const getRandomIntegerNumber = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const getDate = (date) => {
  return {
    start: new Date(date.setMinutes(date.getMinutes() + getRandomIntegerNumber(TimePeriodInMinute.MIN, TimePeriodInMinute.MAX))),
    end: new Date(date.setMinutes(date.getMinutes() + getRandomIntegerNumber(TimePeriodInMinute.MIN, TimePeriodInMinute.MAX))),
  };
};

export {GroupType, offersStructure, offerNames, groupToTypes, groupTypeToPreposition, typeToGroup, cities, getDate};
