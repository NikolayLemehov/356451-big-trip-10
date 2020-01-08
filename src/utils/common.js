import moment from 'moment';

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

const formatDate = (date) => {
  return moment(date).format(`DD/MM/YY`);
};

const getDuration = (start, end) => {
  const interval = moment.duration(end - start);
  const days = interval.days() >= 1 ? `${castTimeFormat(interval.days())}D ` : ``;
  const hours = interval.asHours() >= 1 ? `${castTimeFormat(interval.hours())}H ` : ``;
  const minutes = `${castTimeFormat(interval.minutes())}M`;

  return `${days}${hours}${minutes}`;
};

const getExactDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export {formatTime, formatDate, getDuration, getExactDate};
