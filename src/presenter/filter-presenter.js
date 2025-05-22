import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { UpdateType } from '../const.js';
import { generateFilters } from '../filter-sort-data/filter-data.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #routePointsModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, routePointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#routePointsModel = routePointsModel;

    this.#routePointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const filters = generateFilters(this.#routePointsModel.points);
    const currentFilterType = this.#filterModel.filter;
    const prevComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(
      filters,
      this.#handleFilterTypeChange,
      currentFilterType
    );

    if (!prevComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevComponent);
    remove(prevComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
