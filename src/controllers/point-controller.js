import EventComponent from "../components/event-component";
import EventEditComponent from "../components/event-edit-component";
import {renderElement} from "../utils/render";

export default class PointController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDatachange = onDataChange;
  }

  render(event) {
    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replaceEditToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const replaceEditToEvent = () => {
      this._container.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
    };

    const replaceEventToEdit = () => {
      this._container.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
    };

    const eventComponent = new EventComponent(event);
    eventComponent.setEditButtonClickHandler(() => {
      replaceEventToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    const eventEditComponent = new EventEditComponent(event);
    eventEditComponent.getSubmitHandler(replaceEditToEvent);

    renderElement(this._container, eventComponent);
  }
}
