import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class RoutePointsModel extends Observable {
  #points = [];
  #allOffers = [];
  #allDestinations = [];
  #eventsApiService = null;

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;
  }

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

  async init() {
    try {
      const [points, offers, dests] = await Promise.all([
        this.#eventsApiService.points,
        this.#eventsApiService.offers,
        this.#eventsApiService.destinations,
      ]);

      this.#points = points;
      this.#allOffers = offers;
      this.#allDestinations = dests;

      this._notify(UpdateType.INIT);
    } catch (error) {
      this.#points = [];
      this.#allOffers = [];
      this.#allDestinations = [];

      this._notify(UpdateType.ERROR);
    }
  }

  async addPoint(updateType, update) {
    const newPoint = await this.#eventsApiService.addPoint(update);

    this.#points = [
      newPoint,
      ...this.#points
    ];

    this.#sortPointsByDate();

    this._notify(updateType, newPoint);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting Point');
    }

    const updatedEvent = await this.#eventsApiService.updatePoint(update);

    this.#points = [
      ...this.#points.slice(0, index),
      updatedEvent,
      ...this.#points.slice(index + 1),
    ];

    this.#sortPointsByDate();

    this._notify(updateType, updatedEvent);
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting Point');
    }

    await this.#eventsApiService.deletePoint(update);

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
