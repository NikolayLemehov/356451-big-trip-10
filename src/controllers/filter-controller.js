import {renderElement, replaceElement} from '../utils/render';
import FilterListComponent from '../components/filter-list-component';
import FilterListTitleComponent from '../components/filter-list-title-component';

export default class FilterController {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._filterListTitleComponent = new FilterListTitleComponent();

    this._filterListComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    renderElement(this._container, this._filterListTitleComponent);
  }

  render() {
    const oldComponent = this._filterListComponent;

    this._filterListComponent = new FilterListComponent(this._eventsModel.getFilters());
    this._filterListComponent.setFilterTypeChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replaceElement(this._filterListComponent, oldComponent);
    } else {
      renderElement(this._container, this._filterListComponent);
    }
  }

  show() {
    this._filterListTitleComponent.show();
    this._filterListComponent.show();
  }

  hide() {
    this._filterListTitleComponent.hide();
    this._filterListComponent.hide();
  }

  _onFilterChange(filterType) {
    this._eventsModel.setFilter(filterType);
  }
}
