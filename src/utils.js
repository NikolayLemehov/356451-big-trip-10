const RenderPosition = {
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDate = (date) => {
  const years = castTimeFormat(date.getFullYear()).slice(-2);
  const months = castTimeFormat(date.getMonth() + 1);
  const days = castTimeFormat(date.getDate());

  return `${days}/${months}/${years}`;
};

const getDuration = (start, end) => {
  const interval = new Date(end - start);
  const days = interval.getDate() - 1;
  const hours = interval.getUTCHours();
  const minutes = interval.getMinutes();

  return `${days === 0 ? `` : castTimeFormat(days) + `D `}\
  ${hours === 0 ? `` : castTimeFormat(hours) + `H `}\
  ${minutes === 0 ? `` : castTimeFormat(minutes) + `M`}`;
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {formatTime, formatDate, getDuration, createElement, render, RenderPosition};
