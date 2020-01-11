import {renderElement, RenderPosition, replaceElement} from "../utils/render";
import FilterListComponent from "../components/filter-list-component";

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;

    this._filterListComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    const oldComponent = this._filterListComponent;

    this._filterListComponent = new FilterListComponent(this._eventsModel.getFilters());
    this._filterListComponent.setFilterTypeChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replaceElement(this._filterListComponent, oldComponent);
    } else {
      renderElement(this._container, this._filterListComponent, RenderPosition.AFTEREND);
    }
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
  }
}
