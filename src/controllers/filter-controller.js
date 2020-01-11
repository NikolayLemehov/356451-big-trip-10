import {renderElement, RenderPosition, replaceElement} from "../utils/render";
import FilterListComponent from "../components/filter-list-component";

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._filterListComponent = null;
  }

  render() {
    const oldComponent = this._filterListComponent;

    this._filterListComponent = new FilterListComponent(this._eventsModel.getFilters());

    if (oldComponent) {
      replaceElement(this._filterListComponent, oldComponent);
    } else {
      renderElement(this._container, this._filterListComponent, RenderPosition.AFTEREND);
    }
  }
}
