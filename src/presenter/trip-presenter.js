import { render } from '../framework/render.js';
import TripInfo from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventList from '../view/event-list-view.js';
import RoutePointsModel from '../model/route-point-model.js';
import ListMessageView from '../view/empty-list-message-view.js';
import { generateFilters } from '../mock/filter-data.js';
import { messages } from '../mock/message-data.js';
import { generateSort } from '../mock/sort-data.js';
import RoutePointPresenter from './route-point-presenter.js';
import { updatePoint, sortRoutePoints } from '../utils.js';
import { SortType } from '../const.js';
import { RenderPosition } from '../framework/render.js';

export default class TripPresenter {
  #eventsListContainer = new EventList();
  #routePointsModel = new RoutePointsModel();
  #routePointsPresenter = new Map();
  #routePoints = this.#routePointsModel.getRoutePoints();
  #sortedRoutePoints = null;
  #currentSortType = SortType.DAY;

  constructor() {
    this.tripInfoContainer = document.querySelector('.trip-main');
    this.filterContainer = document.querySelector('.trip-controls__filters');
    this.eventsContainer = document.querySelector('.trip-events');
  }

  init() {
    this.#renderTripInfo();
    this.#renderFilters(this.#routePoints);
    this.#renderSort(this.#routePoints);

    if (!this.#routePoints.length) {
      this.#renderEmptyList();
      return;
    }

    this.#renderRoutePointsList(this.#routePoints);
  }

  #renderTripInfo = () => render(new TripInfo(), this.tripInfoContainer, RenderPosition.AFTERBEGIN);

  #renderFilters(routePoints) {
    const filters = generateFilters(routePoints);
    render(new FilterView(filters), this.filterContainer);
  }

  #renderSort(routePoints) {
    const sort = generateSort(routePoints);
    render(new SortView(sort, this.#onSortTypeChange), this.eventsContainer);
  }

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#sortedRoutePoints = sortRoutePoints(this.#routePoints, this.#currentSortType);
    this.#clearRoutePointsList();
    this.#renderRoutePointsList(this.#sortedRoutePoints);
  };

  #clearRoutePointsList() {
    this.#routePointsPresenter.forEach((presenter) => presenter.destroy());
    this.#routePointsPresenter.clear();
  }

  #renderEmptyList() {
    render(new ListMessageView(messages.everything), this.eventsContainer);
  }

  #renderRoutePointsList(routePoints) {
    render(this.#eventsListContainer, this.eventsContainer);

    routePoints.forEach((routePoint) => {
      if (routePoint.id && routePoint.date_from && routePoint.type) {
        this.#renderRoutePoint(routePoint);
      }
    });
  }

  #onDataChange = (updatedPoint) => {
    this.#routePoints = updatePoint(this.#routePoints, updatedPoint);
  };

  #onModeChange = () => {
    this.#routePointsPresenter.forEach((point) => point.resetPointMode());
  };

  #renderRoutePoint(routePoint) {
    const routePointPresenter = new RoutePointPresenter(
      this.#eventsListContainer.element,
      this.#onDataChange,
      this.#onModeChange
    );

    routePointPresenter.init(routePoint);
    this.#routePointsPresenter.set(routePoint.id, routePointPresenter);
  }
}
