import {renderElement, RenderPosition} from "../utils/render";
import FilterListComponent from "../components/filter-list-component";
import {filterToChecked} from "../const";

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
  }

  render() {
    renderElement(this._container, new FilterListComponent(filterToChecked), RenderPosition.AFTEREND);
  }
}
