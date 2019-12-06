const types = [`bus`, `check-in`, `drive`, `flight`, `restaurant`, `ship`, `sightseeing`, `taxi`, `train`, `transport`, `trip`];
const cities = [`Geneva`, `Copenhagen`, `Amsterdam`, `Lisbon`, `Riga`, `Helsinki`, `Dresden`];
const phrases = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];
const RANDOM_PHOTO_URL_PREFIX = `http://picsum.photos/300/150?r=`;
const PhotoCount = {
  MIN: 3,
  MAX: 10,
};
const PhraseCount = {
  MIN: 1,
  MAX: 3,
};
const TimePeriodInMinute = {
  MIN: 10,
  MAX: 60 * 12,
};
const Price = {
  MIN: 5,
  MAX: 200,
};
const OfferCount = {
  MIN: 0,
  MAX: 2,
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

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomIntegerNumber = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
const getRandomArrayItem = (array) => array[getRandomIntegerNumber(0, array.length - 1)];

const getRandomPhotoUrl = () => `${RANDOM_PHOTO_URL_PREFIX}${Math.random()}`;
const generatePhotos = () => {
  return new Array(getRandomIntegerNumber(PhotoCount.MIN, PhotoCount.MAX))
    .fill(``)
    .map(getRandomPhotoUrl);
};

const getDate = (date) => {
  return {
    start: new Date(date.setMinutes(date.getMinutes() + getRandomIntegerNumber(TimePeriodInMinute.MIN, TimePeriodInMinute.MAX))),
    end: new Date(date.setMinutes(date.getMinutes() + getRandomIntegerNumber(TimePeriodInMinute.MIN, TimePeriodInMinute.MAX))),
  };
};

const getOffer = (names) => {
  return names.map((it) => offersStructure[it]);
};
const typeToOffer = new Map();
types.forEach((type) => {
  const count = getRandomIntegerNumber(OfferCount.MIN, OfferCount.MAX);
  typeToOffer.set(type, getOffer(shuffle(offerNames.slice()).slice(count === 0 ? offerNames.length : -1 * count)));
});

const generateEvent = (date) => {
  const type = getRandomArrayItem(types);
  return {
    type,
    city: getRandomArrayItem(cities),
    photos: generatePhotos(),
    destination: shuffle(phrases.slice()).slice(-1 * getRandomIntegerNumber(PhraseCount.MIN, PhraseCount.MAX)).join(` `),
    date: getDate(date),
    price: getRandomIntegerNumber(Price.MIN, Price.MAX),
    offers: typeToOffer.get(type),
  };
};

const generateEvents = (count) => {
  let currentDate = new Date(2019, 11, 4);
  return new Array(count)
    .fill(``)
    .map(() => generateEvent(currentDate));
};

export {generateEvents, offersStructure, offerNames};
