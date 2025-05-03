import AbstractView from '../framework/view/abstract-view.js';
import { formatDate, formatTime, formatDatetime, calculateDuration } from '../utils.js';

const createRoutePointTemplate = (routePoint, destinations, offersByType) => {
  const { base_price: basePrice, date_from: dateFrom, date_to: dateTo, destination, is_favorite: isFavorite, offers, type } = routePoint;

  const formattedDate = formatDate(dateFrom);
  const startTime = formatTime(dateFrom);
  const endTime = formatTime(dateTo);

  const datetime = formatDatetime(dateFrom);
  const datetimeFrom = formatDatetime(dateFrom, true);
  const datetimeTo = formatDatetime(dateTo, true);

  const durationValue = calculateDuration(dateFrom, dateTo);
  const city = destinations.find((dest) => dest.id === destination).name;

  const availableOffers = offersByType.find((offer) => offer.type === type).offers;

  const selectedOffers = availableOffers
    .filter((offer) => offers.includes(offer.id));

  const offerItems = selectedOffers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('');

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${datetime}">${formattedDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${city}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${datetimeFrom}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${datetimeTo}">${endTime}</time>
          </p>
          <p class="event__duration">${durationValue}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offerItems}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export default class RoutePointView extends AbstractView {
  #onOpenEditButtonClick = null;
  #onFavoriteClick = null;
  #routePoint = null;
  #destinations = null;
  #offersByType = null;

  constructor(routePoint, destinations, offers, onOpenEditButtonClick, onFavoriteClick) {
    super();
    this.#routePoint = routePoint;
    this.#destinations = destinations;
    this.#offersByType = offers;

    this.#onOpenEditButtonClick = onOpenEditButtonClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.#setEventListeners();
  }

  get template() {
    return createRoutePointTemplate(this.#routePoint, this.#destinations, this.#offersByType);
  }

  #setEventListeners() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openEditButtonClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteButtonClickHandler);
  }

  #openEditButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onOpenEditButtonClick();
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick(this.#routePoint);
  };
}
