import { render } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import CreateEditEventView from '../view/create-event-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import EventList from '../view/event-list-view.js';
import RoutePointsModel from '../model/route-point-model.js';


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
    render(new CreateEditEventView(routePoints[9]), this.eventsListContainer.getElement());

    routePoints.forEach((routePoint) => {
      if (routePoint.city) {
        render(new RoutePointView(routePoint), this.eventsListContainer.getElement());
        render(new CreateEditEventView(routePoint), this.eventsListContainer.getElement());
      }
    });
  }
}
