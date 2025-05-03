import { mockRoutePoints, offersByType, destinations } from '../mock/mock-route-data.js';
import Observable from '../framework/observable.js';

export default class RoutePointsModel extends Observable {
  #points = [...mockRoutePoints];
  #allOffers = [...offersByType];
  #allDestinations = [...destinations];

  get points() {
    this.#sortPointsByDate();
    return this.#points;
  }

  get offers() {
    return this.#allOffers;
  }

  get destinations() {
    return this.#allDestinations;
  }

  setPoints(updateType, update) {
    this.#points = [...update];
    this.#sortPointsByDate();
    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    if (
      !update.type ||
      !update.base_price ||
      !update.date_from ||
      !update.date_to ||
      !update.destination
    ) {
      return;
    }

    this.#points = [
      update,
      ...this.#points,
    ];

    this.#sortPointsByDate();

    this._notify(updateType, update);
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting Point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this.#sortPointsByDate();

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting Point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this.#sortPointsByDate();

    this._notify(updateType, update);
  }

  #sortPointsByDate() {
    this.#points.sort((a, b) => new Date(a.date_from) - new Date(b.date_from));
  }
}
