import { render, replace } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import CreateEditEventView from '../view/create-event-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import EventList from '../view/event-list-view.js';
import RoutePointsModel from '../model/route-point-model.js';
import ListMessageView from '../view/empty-list-message-view.js';
import { isEscapeKey } from '../utils.js';
import { generateFilters } from '../mock/filter-data.js';
import { messages } from '../mock/message-data.js';
import { generateSort } from '../mock/sort-data.js';


export default class TripPresenter {
  constructor() {
    this.eventsListContainer = new EventList;
    this.filterContainer = document.querySelector('.trip-controls__filters');
    this.eventsContainer = document.querySelector('.trip-events');
    this.routePointsModel = new RoutePointsModel();
  }

  init() {
    const routePoints = this.routePointsModel.getRoutePoints();
    const filters = generateFilters(routePoints);
    const sort = generateSort(routePoints);

    render(new FilterView(filters), this.filterContainer);
    render(new SortView(sort), this.eventsContainer);

    if (routePoints.length === 0) {
      render(new ListMessageView(messages.everything), this.eventsContainer);
      return;
    }

    render(this.eventsListContainer, this.eventsContainer);

    routePoints.forEach((routePoint) => {
      if (routePoint.city) {
        this.#renderRoutePoint(routePoint);
      }
    });
  }

  #renderRoutePoint(routePoint) {
    const onEscKeyDown = (evt) => {
      if (isEscapeKey(evt)) {
        replaceEditPointToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const onOpenEditButtonClick = () => {
      replacePointToEditPoint();
      document.addEventListener('keydown', onEscKeyDown);
    };

    const onCloseEditButtonClick = () => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const onSubmitButtonClick = () => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const point = new RoutePointView(routePoint, onOpenEditButtonClick);
    const editPoint = new CreateEditEventView(routePoint, onCloseEditButtonClick, onSubmitButtonClick);

    function replacePointToEditPoint() {
      replace(editPoint, point);
    }

    function replaceEditPointToPoint() {
      replace(point, editPoint);
    }

    render(point, this.eventsListContainer.element);
  }
}
