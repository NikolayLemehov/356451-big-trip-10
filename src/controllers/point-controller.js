import moment from 'moment';
import EventComponent from '../components/event-component';
import EventEditComponent from '../components/event-edit-component';
import EventAdapterModel from '../models/event-adapter-model';
import {removeElement, renderElement, RenderPosition, replaceElement} from '../utils/render';
import {EmptyEvent, Mode} from '../const';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._replaceEditToEvent = this._replaceEditToEvent.bind(this);
  }

  render(eventAdapterModel, mode, backEndStaticData) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._mode = mode;
    this._eventComponent = new EventComponent(eventAdapterModel);
    this._eventEditComponent = new EventEditComponent(eventAdapterModel, backEndStaticData);


    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setRollupButtonClickHandler(() => {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
      } else {
        this._replaceEditToEvent();
      }
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setCancelButtonClickHandler(() => {
      this._onDataChange(this, EmptyEvent, null);
    });

    this._eventEditComponent.setFavoriteToggleHandler((isChange) => {
      if (!isChange || eventAdapterModel.isNewEvent) {
        return;
      }
      this._eventEditComponent.disableForm();
      const newEventAdapterModel = EventAdapterModel.clone(eventAdapterModel);
      newEventAdapterModel.isFavorite = !newEventAdapterModel.isFavorite;
      const isDoUpdateEvents = false;
      this._onDataChange(this, eventAdapterModel, newEventAdapterModel, isDoUpdateEvents);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      this._eventEditComponent.validateForm();
      if (this._eventEditComponent.getElement().checkValidity()) {
        evt.preventDefault();
        const componentData = this._eventEditComponent.getData();
        this._eventEditComponent.disableSave();
        this._eventEditComponent.disableForm();
        const newEventAdapterModel = this._parseFormData(componentData, eventAdapterModel);
        this._onDataChange(this, eventAdapterModel, newEventAdapterModel);
      }
    });

    this._eventEditComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._eventEditComponent.disableDelete();
      this._eventEditComponent.disableForm();
      this._onDataChange(this, eventAdapterModel, null);
    });


    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replaceElement(this._eventComponent, oldEventComponent);
          replaceElement(this._eventEditComponent, oldEventEditComponent);
        } else {
          renderElement(this._container, this._eventComponent);
        }
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          removeElement(oldEventComponent);
          removeElement(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        renderElement(this._container, this._eventEditComponent, RenderPosition.AFTEREND);
        break;
    }
  }

  destroy() {
    removeElement(this._eventEditComponent);
    removeElement(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    const removeAnimation = () => {
      this._eventEditComponent.getElement().classList.remove(`shake`);
      this._eventEditComponent.deactivateWarningFrame();
    };
    const animate = () => {
      this._eventEditComponent.activeSave();
      this._eventEditComponent.activeDelete();
      this._eventEditComponent.activeForm();

      this._eventEditComponent.activateWarningFrame();

      this._eventEditComponent.getElement().classList.add(`shake`);
      setTimeout(removeAnimation, SHAKE_ANIMATION_TIMEOUT);
    };
    setTimeout(animate, SHAKE_ANIMATION_TIMEOUT);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  _parseFormData({formData, destination, offers, typeToOffers}, eventAdapterModel) {
    return EventAdapterModel.replenishOffers(typeToOffers.get(formData.get(`event-type`)), new EventAdapterModel({
      'id': eventAdapterModel.id,
      'type': formData.get(`event-type`),
      'date_from': new Date(moment(formData.get(`event-start-time`), `DD-MM-YY HH:mm`).utc().format()).toISOString(),
      'date_to': new Date(moment(formData.get(`event-end-time`), `DD-MM-YY HH:mm`).utc().format()).toISOString(),
      'destination': {
        'name': formData.get(`event-destination`),
        'description': destination.description,
        'pictures': destination.photos.map((it) => {
          return {
            'src': it.src,
            'description': it.description,
          };
        }),
      },
      'base_price': formData.get(`event-price`),
      'is_favorite': !!formData.get(`event-favorite`),
      'offers': offers.filter((it) => it.isChecked).map((it) => {
        return {
          'title': it.title,
          'price': it.price,
        };
      }),
    }));
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._eventEditComponent.reset();
    replaceElement(this._eventComponent, this._eventEditComponent);
    this._mode = Mode.DEFAULT;
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replaceElement(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyEvent, null);
      }
      this._replaceEditToEvent();
    }
  }
}
