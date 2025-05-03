import { render, remove } from '../framework/render.js';
import TripInfo from '../view/trip-info-view.js';
import SortView from '../view/sort-view.js';
import EventList from '../view/event-list-view.js';
import ListMessageView from '../view/empty-list-message-view.js';
import { generateSort } from '../mock/sort-data.js';
import RoutePointPresenter from './route-point-presenter.js';
import { sortRoutePoints, getTripInfo } from '../utils.js';
import { RenderPosition } from '../framework/render.js';
import { SortType, UpdateType, UserAction, EmptyListMessage, FilterType } from '../const.js';
import { filter } from '../mock/filter-data.js';
import NewRoutePointPresenter from './new-route-point-presenter.js';

export default class TripPresenter {
  #eventsListContainer = new EventList();
  #routePointsModel = null;
  #routePointsPresenter = new Map();
  #routePoints = null;
  #sortedRoutePoints = null;
  #currentSortType = SortType.DAY;
  #filterModel = null;
  #sortComponent = null;
  #listMessageComponent = null;
  #tripInfoComponent = null;
  #newRoutePointPresenter = null;

  constructor(routePointsModel, filterModel, newPointButtonComponent) {
    this.#routePointsModel = routePointsModel;
    this.#filterModel = filterModel;
    this.newPointButtonComponent = newPointButtonComponent;

    this.tripInfoContainer = document.querySelector('.trip-main');
    this.filterContainer = document.querySelector('.trip-controls__filters');
    this.eventsContainer = document.querySelector('.trip-events');

    this.#newRoutePointPresenter = new NewRoutePointPresenter(
      this.#eventsListContainer.element,
      this.#onDataChange,
      this.#onNewPointFormClose
    );


    this.#routePointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#routePoints = this.#getFilteredPoints();

    this.#renderTripInfo();
    this.#renderSort(this.#routePoints);

    if (!this.#routePoints.length) {
      this.#renderEmptyList();
      return;
    }

    this.#renderRoutePointsList(this.#routePoints);
  }

  createPoint() {
    this.#onModeChange();
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newRoutePointPresenter.init();
  }

  isNewPointFormOpen() {
    return this.#newRoutePointPresenter.isFormOpen();
  }

  #onNewPointFormClose = () => {
    if (this.newPointButtonComponent) {
      this.newPointButtonComponent.enableButton();
    }
  };

  #getFilteredPoints() {
    const filterType = this.#filterModel.filter;
    const points = this.#routePointsModel.points.filter(this.#isValidPoint);
    return filter[filterType](points);
  }

  #renderTripInfo = () => {
    const tripInfoData = getTripInfo(this.#routePoints, this.#routePointsModel.destinations, this.#routePointsModel.offers);

    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
    }

    this.#tripInfoComponent = new TripInfo(tripInfoData);
    render(this.#tripInfoComponent, this.tripInfoContainer, RenderPosition.AFTERBEGIN);
  };

  #renderSort(routePoints) {
    const sort = generateSort(routePoints);
    this.#sortComponent = new SortView(sort, this.#onSortTypeChange);
    render(this.#sortComponent, this.eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #clearSort() {
    if (this.#sortComponent) {
      this.#sortComponent.element.remove();
      this.#sortComponent = null;
    }
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

  #clearRoutePointsList(resetSortType = false) {
    this.#routePointsPresenter.forEach((presenter) => presenter.destroy());
    this.#routePointsPresenter.clear();

    if (this.#listMessageComponent) {
      this.#listMessageComponent.element.remove();
      this.#listMessageComponent = null;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
      this.#clearSort();
      this.#renderSort(this.#routePoints);
    }
  }

  #renderEmptyList() {
    const filterType = this.#filterModel.filter;
    const message = EmptyListMessage[filterType] || EmptyListMessage.EVERYTHING;
    this.#listMessageComponent = new ListMessageView(message);
    render(this.#listMessageComponent, this.eventsContainer);
  }

  #isValidPoint = (point) => (
    point.id !== '' &&
    point.base_price > 0 &&
    point.date_from !== null &&
    point.date_to !== null &&
    point.type.trim() !== ''
  );

  #renderRoutePointsList(routePoints) {
    render(this.#eventsListContainer, this.eventsContainer);

    routePoints.forEach((routePoint) => {
      this.#renderRoutePoint(routePoint);
    });
  }

  #onModeChange = () => {
    this.#routePointsPresenter.forEach((point) => point.resetPointMode());
  };

  #renderRoutePoint(routePoint) {
    const routePointPresenter = new RoutePointPresenter(
      this.#eventsListContainer.element,
      this.#onDataChange,
      this.#onModeChange,
      () => this.#newRoutePointPresenter.isFormOpen()
    );

    routePointPresenter.init(routePoint);
    this.#routePointsPresenter.set(routePoint.id, routePointPresenter);
  }

  #handleModelEvent = (updateType, data) => {
    this.#routePoints = this.#getFilteredPoints();
    this.#renderTripInfo();

    switch (updateType) {
      case UpdateType.PATCH:
        this.#routePointsPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearRoutePointsList();
        if (!this.#routePoints.length) {
          this.#clearSort();
          this.#renderSort(this.#routePoints);
          this.#renderEmptyList();
        } else {
          this.#renderRoutePointsList(this.#routePoints);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearRoutePointsList(true);
        if (!this.#routePoints.length) {
          this.#renderEmptyList();
        } else {
          this.#renderRoutePointsList(this.#routePoints);
        }
        break;
    }
  };

  #onDataChange = (userAction, updateType, update) => {
    switch (userAction) {
      case UserAction.UPDATE_POINT:
        this.#routePointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#routePointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#routePointsModel.deletePoint(updateType, update);
        break;
    }
  };
}
