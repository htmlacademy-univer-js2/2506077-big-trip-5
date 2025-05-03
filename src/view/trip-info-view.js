import AbstractView from '../framework/view/abstract-view.js';

const createTripInfoTemplate = ({ title, dates, cost }) => `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${dates}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>
`;

export default class TripInfo extends AbstractView {
  #data;

  constructor(data) {
    super();
    this.#data = data;
  }

  get template() {
    return createTripInfoTemplate(this.#data);
  }
}
