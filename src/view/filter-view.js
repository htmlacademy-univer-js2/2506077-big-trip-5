import AbstractView from '../framework/view/abstract-view.js';

const generateFilterButtons = (filters) => filters.map(({ type, count }) => `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"
      ${type === 'everything' ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>
  `).join('');

const createFilterTemplate = (filters) => `
  <form class="trip-filters" action="#" method="get">
    ${generateFilterButtons(filters)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class FilterView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
