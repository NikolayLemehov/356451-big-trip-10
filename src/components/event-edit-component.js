import flatpickr from 'flatpickr';
import {formatDate, formatTime} from "../utils/common";
import {groupToTypes, groupTypeToPreposition, typeToGroup} from "../const";
import AbstractSmartComponent from "./abstract-smart-component";

const FLATPICKR_DATE_FORMAT = `d/m/y H:i`;
const eventTypeTemplate = (type, checkedType) => {
  const isCheckedType = type === checkedType ? `checked` : ``;
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
        value="${type}" ${isCheckedType}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`
  );
};
const createEventTypeGroupTemplate = (group, checkedType) => {
  const eventTypesTemplate = Array.from(groupToTypes.get(group)).map((it) => eventTypeTemplate(it, checkedType)).join(``);
  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${group}</legend>
      ${eventTypesTemplate}
    </fieldset>`
  );
};

const createOfferTemplate = (offer) => {
  const {name, title, price, isChecked} = offer;
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
        id="${name}"
        type="checkbox"
        name="${name}"
        ${isChecked ? `checked` : ``}
      >
      <label class="event__offer-label" for="${name}">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createEditEventTemplate = (event, destinations, option) => {
  const {date, price, isFavorite, isNewEvent} = event;
  const {type, destination, offers, hasDestination} = option;

  const startDate = `${formatDate(date.start)} ${formatTime(date.start)}`;
  const endDate = `${formatDate(date.end)} ${formatTime(date.end)}`;
  const preposition = groupTypeToPreposition.get(typeToGroup.get(type));

  const offersMarkUp = offers.length > 0 ? offers.map((it) => createOfferTemplate(it)).join(``) : ``;
  const eventTypeGroupsTemplate = Array.from(groupToTypes.keys()).map((it) => createEventTypeGroupTemplate(it, type)).join(``);

  const photoElementsTemplate = destination.photos
    .map((it) => `<img class="event__photo" src="${it.src}" alt="${it.description}">`).join(``);
  const cityOptionsTemplate = destinations.map((it) => `<option value="${it.city}"></option>`).join(``);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17"
              src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            ${eventTypeGroupsTemplate}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type === `trip` ? `` : `${type} ${preposition}`}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
            value="${destination.city}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${cityOptionsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
            value="${startDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
            value="${endDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price"
            value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>

        <button class="event__reset-btn event__reset-btn--reset ${isNewEvent ? `` : `visually-hidden`}"
          type="reset">Reset</button>
        <button class="event__reset-btn event__reset-btn--delete ${isNewEvent ? `visually-hidden` : ``}"
          type="button"">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite"
          ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Close event</span>
        </button>
      </header>
      <section class="event__details">

        ${offers.length > 0 ? `
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersMarkUp}
          </div>
        </section>` : ``}

        ${hasDestination ? `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${photoElementsTemplate}
            </div>
          </div>
        </section>` : ``}

      </section>
    </form>`
  );
};

export default class EventEditComponent extends AbstractSmartComponent {
  constructor(event, {destinations, typeToOffers}) {
    super();
    this._event = event;
    this._destinations = destinations;
    this._typeToOffers = typeToOffers;

    this._type = event.type;
    this._destination = event.destination;
    this._offers = event.offers;
    this._hasDestination = !!event.destination.description && event.destination.photos.length > 0;

    this._saveBtnElement = this.getElement().querySelector(`.event__save-btn`);
    this._deleteBtnElement = this.getElement().querySelector(`.event__reset-btn--delete`);
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._rollupButtonClickHandler = null;
    this._flatpickr = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventTemplate(this._event, this._destinations, {
      type: this._type,
      destination: this._destination,
      offers: this._offers,
      hasDestination: this._hasDestination,
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setRollupButtonClickHandler(this._rollupButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender(onFocusElement) {
    super.rerender();

    this._applyFlatpickr();
    if (onFocusElement) {
      onFocusElement();
    }
  }

  reset() {
    const event = this._event;

    this._type = event.type;
    this._destination = event.destination;
    this._offers = event.offers;
    this._hasDestination = !!event.destination.description && event.destination.photos.length > 0;
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this._deleteBtnElement.addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  getData() {
    const form = this.getElement();
    return {
      formData: new FormData(form),
      destination: this._destination,
      offers: this._offers,
      typeToOffers: this._typeToOffers,
    };
  }

  setFavoriteToggleHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, handler);
  }

  setRollupButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
    this._rollupButtonClickHandler = handler;
  }

  disableSave() {
    this._saveBtnElement.disabled = `disabled`;
    this._saveBtnElement.textContent = `Saving...`;
  }

  activeSave() {
    this._saveBtnElement.disabled = ``;
    this._saveBtnElement.textContent = `Save`;
  }

  disableDelete() {
    this._deleteBtnElement.disabled = `disabled`;
    this._deleteBtnElement.textContent = `Deleting...`;
  }

  activeDelete() {
    this._deleteBtnElement.disabled = ``;
    this._deleteBtnElement.textContent = `Delete`;
  }


  _applyFlatpickr() {
    const DateType = {
      START: `start`,
      END: `end`,
    };
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    this._applyFlatpickrItem(DateType.START);
    this._applyFlatpickrItem(DateType.END);
  }

  _applyFlatpickrItem(dateType) {
    const startDateElement = this.getElement().querySelector(`#event-${dateType}-time-1`);
    this._flatpickr = flatpickr(startDateElement, {
      altInput: true,
      allowInput: true,
      altFormat: FLATPICKR_DATE_FORMAT,
      dateFormat: FLATPICKR_DATE_FORMAT,
      enableTime: true,
      // eslint-disable-next-line camelcase
      time_24hr: true,
      defaultDate: this._event.date[dateType] === null ? new Date() : this._event.date[dateType],
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      const radioTypeInputElement = evt.path.find((it) => {
        return (it.classList) ? it.classList.contains(`event__type-input`) : false;
      });
      if (radioTypeInputElement) {
        this._type = radioTypeInputElement.value;
        this._offers = this._typeToOffers.get(this._type);
        this.rerender();
      }
    });

    element.querySelectorAll(`.event__offer-checkbox`).forEach((checkboxElement, i) => {
      checkboxElement.addEventListener(`change`, () => {
        this._offers[i].isChecked = !this._offers[i].isChecked;
      });
    });

    element.querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const destination = this._destinations.find((it) => it.city === evt.target.value);
      if (destination) {
        this._hasDestination = true;
        this._destination = destination;
        this.rerender(() => {
          const newElement = this.getElement().querySelector(`.event__input--destination`);
          newElement.focus();
          newElement.selectionStart = newElement.value.length;
        });
      } else {
        this._hasDestination = false;
        element.querySelector(`.event__section--destination`).remove();
      }
    });

    element.querySelector(`.event__reset-btn--reset`).addEventListener(`click`, () => {
      this._type = `trip`;
      this._destination = {
        city: ``,
        description: ``,
        photos: [],
      };
      this._offers = [];
      this._hasDestination = false;
      this.rerender();
    });
  }
}
