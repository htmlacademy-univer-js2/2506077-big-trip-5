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

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting Point');
    }

    try {
      const updatedEvent = await this.#eventsApiService.updatePoint(update);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedEvent,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedEvent);
    } catch(error) {
      throw new Error('Can\'t update Point');
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
