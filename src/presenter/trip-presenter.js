import { render, remove } from '../framework/render.js';
import TripInfo from '../view/trip-info-view.js';
import SortView from '../view/sort-view.js';
import EventList from '../view/event-list-view.js';
import ListMessageView from '../view/empty-list-message-view.js';
import { generateSort } from '../filter-sort-data/sort-data.js';
import RoutePointPresenter from './route-point-presenter.js';
import { sortRoutePoints, getTripInfo } from '../utils.js';
import { RenderPosition } from '../framework/render.js';
import { SortType, UpdateType, UserAction, EmptyListMessage, FilterType } from '../const.js';
import { filter } from '../filter-sort-data/filter-data.js';
import NewRoutePointPresenter from './new-route-point-presenter.js';
import LoadView from '../view/load-view.js';
import ErrorView from '../view/error-view.js';

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
  #newPointButtonComponent = null;
  #isLoading = true;
  #loadComponent = null;
  #errorComponent = null;
  #filterPresenter = null;
  #destinations = null;
  #offersByType = null;

  constructor(routePointsModel, filterModel, newPointButtonComponent, filterPresenter) {
    this.#routePointsModel = routePointsModel;
    this.#filterModel = filterModel;
    this.#newPointButtonComponent = newPointButtonComponent;
    this.#filterPresenter = filterPresenter;

    this.tripInfoContainer = document.querySelector('.trip-main');
    this.filterContainer = document.querySelector('.trip-controls__filters');
    this.eventsContainer = document.querySelector('.trip-events');

    this.#routePointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#routePoints = this.#getFilteredPoints();

    if (this.#isLoading) {
      this.#renderLoadingComponent();
      return;
    }

    if (!this.#routePoints.length) {
      this.#renderEmptyList();
      return;
    }

    this.#renderRoutePointsList(this.#routePoints);
  }

  #onNewPointButtonClick = () => {
    this.#onModeChange();
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#removeEmptyMessage();

    this.#newRoutePointPresenter.init();
    this.#newPointButtonComponent.disableButton();
  };

  #isNewPointFormOpen() {
    return this.#newRoutePointPresenter.isFormOpen();
  }

  #onNewPointFormClose = () => {
    if (this.#newPointButtonComponent) {
      this.#newPointButtonComponent.enableButton();
    }
    if (!this.#routePoints.length) {
      this.#renderEmptyList();
    }
  };

  #getFilteredPoints() {
    const filterType = this.#filterModel.filter;
    const points = this.#routePointsModel.points.filter(this.#isValidPoint);
    return filter[filterType](points);
  }

  #renderTripInfo = () => {
    const tripInfoData = getTripInfo(this.#routePointsModel.points, this.#routePointsModel.destinations, this.#routePointsModel.offers);

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
    this.#removeLoadingComponent();
    this.#removeErrorComponent();

    this.#removeEmptyMessage();

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
      this.#clearSort();
      this.#renderSort(this.#routePoints);
    }
  }

  #renderLoadingComponent() {
    this.#loadComponent = new LoadView();
    render(this.#loadComponent, this.eventsContainer);
  }

  #renderErrorComponent() {
    this.#errorComponent = new ErrorView();
    render(this.#errorComponent, this.eventsContainer);
  }

  #renderEmptyList() {
    const filterType = this.#filterModel.filter;
    const message = EmptyListMessage[filterType] || EmptyListMessage.EVERYTHING;
    this.#listMessageComponent = new ListMessageView(message);
    render(this.#listMessageComponent, this.#eventsListContainer.element);
  }

  #removeEmptyMessage() {
    if (this.#listMessageComponent) {
      remove(this.#listMessageComponent);
      this.#listMessageComponent = null;
    }
  }

  #removeLoadingComponent() {
    this.#isLoading = false;
    remove(this.#loadComponent);
  }

  #removeErrorComponent() {
    remove(this.#errorComponent);
  }

  #isValidPoint = (point) => (
    point.id !== '' &&
    point.base_price > 0 &&
    point.date_from !== null &&
    point.date_to !== null &&
    point.type.trim() !== ''
  );

  #renderRoutePointsList(routePoints) {
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
      () => this.#isNewPointFormOpen(),
      () => this.#newRoutePointPresenter.destroy(),
      this.#routePointsModel.destinations,
      this.#routePointsModel.offers
    );

    routePointPresenter.init(routePoint);
    this.#routePointsPresenter.set(routePoint.id, routePointPresenter);
  }

  #renderContent() {
    render(this.#eventsListContainer, this.eventsContainer);

    if (!this.#routePoints.length) {
      this.#renderEmptyList();
    } else {
      this.#renderRoutePointsList(this.#routePoints);
    }
  }

  #handleModelEvent = (updateType) => {
    this.#routePoints = this.#getFilteredPoints();

    switch (updateType) {
      case UpdateType.PATCH:
        this.#sortedRoutePoints = sortRoutePoints(this.#routePoints, this.#currentSortType);
        this.#clearRoutePointsList();
        this.#renderRoutePointsList(this.#sortedRoutePoints);
        this.#renderTripInfo();
        break;
      case UpdateType.MINOR:
        this.#clearRoutePointsList();
        this.#renderTripInfo();
        this.#renderContent();
        if (!this.#routePoints.length) {
          this.#clearSort();
          this.#renderSort(this.#routePoints);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearRoutePointsList(true);
        this.#renderTripInfo();
        this.#renderContent();
        break;
      case UpdateType.INIT:
        this.#destinations = this.#routePointsModel.destinations;
        this.#offersByType = this.#routePointsModel.offers;

        this.#newRoutePointPresenter = new NewRoutePointPresenter(
          this.#eventsListContainer.element,
          this.#destinations,
          this.#offersByType,
          this.#onDataChange,
          this.#onNewPointFormClose
        );

        this.#removeLoadingComponent();
        this.#renderSort(this.#routePoints);
        this.#renderTripInfo();
        this.#renderContent();
        this.#filterPresenter.init();
        this.#newPointButtonComponent.init(this.#onNewPointButtonClick);
        break;
      case UpdateType.ERROR:
        this.#removeLoadingComponent();
        this.#renderErrorComponent();
    }
  };

  #onDataChange = async (userAction, updateType, update) => {
    switch (userAction) {
      case UserAction.UPDATE_POINT:
        await this.#routePointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        await this.#routePointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        await this.#routePointsModel.deletePoint(updateType, update);
        break;
    }
  };
}
