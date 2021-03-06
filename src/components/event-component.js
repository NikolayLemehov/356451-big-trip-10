import he from 'he';
import {formatTime, getDuration} from '../utils/common';
import AbstractComponent from './abstract-component';
import {groupTypeToPreposition, typeToGroup} from '../const';

const MAX_SHOWING_OFFER = 3;

const createOffersTemplate = (offers) => offers.filter((it) => it.isChecked).slice(0, MAX_SHOWING_OFFER)
  .map((offer) => {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
       </li>`
    );
  })
  .join(``);

const createEventTemplate = (event) => {
  const {type, date, price: notSanitizedPrice, offers, destination} = event;
  const price = he.encode(String(notSanitizedPrice));
  const startJSONDate = date.start ? date.start.toJSON() : ``;
  const endJSONDate = date.end ? date.end.toJSON() : ``;
  const startFormattedDate = date.start ? formatTime(date.start) : ``;
  const endFormattedDate = date.end ? formatTime(date.end) : ``;
  const duration = date.start && date.end ? getDuration(date.start, date.end) : ``;
  const preposition = groupTypeToPreposition.get(typeToGroup.get(type));

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${preposition} ${he.encode(destination.city)}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startJSONDate}">${startFormattedDate}</time>
            &mdash;
            <time class="event__end-time" datetime="${endJSONDate}">${endFormattedDate}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createOffersTemplate(offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class EventComponent extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
