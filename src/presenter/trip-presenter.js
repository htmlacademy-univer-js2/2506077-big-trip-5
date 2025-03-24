import { render, replace } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import CreateEditEventView from '../view/create-event-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import EventList from '../view/event-list-view.js';
import RoutePointsModel from '../model/route-point-model.js';
import { isEscapeKey } from '../utils.js';


export default class TripPresenter {
  constructor() {
    this.eventsListContainer = new EventList;
    this.filterContainer = document.querySelector('.trip-controls__filters');
    this.eventsContainer = document.querySelector('.trip-events');
    this.routePointsModel = new RoutePointsModel();
  }

  init() {
    const routePoints = this.routePointsModel.getRoutePoints();

    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.eventsContainer);
    render(this.eventsListContainer, this.eventsContainer);

    routePoints.forEach((routePoint) => {
      if (routePoint.city) {
        this.#renderRoutePoint(routePoint);
      }
    });
  }

  #renderRoutePoint(routePoint) {
    const escKeyDownHandler = (evt) => {
      if (isEscapeKey(evt)) {
        replaceEditPointToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const onOpenEditButtonClick = () => {
      replacePointToEditPoint();
      document.addEventListener('keydown', escKeyDownHandler);
    };

    const onCloseEditButtonClick = () => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    };

    const onSubmitButtonClick = () => {
      replaceEditPointToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
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
