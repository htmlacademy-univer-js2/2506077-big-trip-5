import { render } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import CreateEventView from '../view/create-event-form-view.js';
import EditEventView from '../view/edit-event-form-view.js';
import RoutePointView from '../view/route-point-view.js';
import EventList from '../view/event-list-view.js';


export default class TripPresenter {
  constructor() {
    this.eventsListContainer = new EventList;
    this.filterContainer = document.querySelector('.trip-controls__filters');
    this.eventsContainer = document.querySelector('.trip-events');
  }

  init() {
    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.eventsContainer);
    render(this.eventsListContainer, this.eventsContainer);
    render(new EditEventView(), this.eventsListContainer.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.eventsListContainer.getElement());
    }

    render(new CreateEventView(), this.eventsListContainer.getElement());
  }
}
