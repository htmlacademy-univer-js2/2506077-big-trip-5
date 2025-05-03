import AbstractView from '../framework/view/abstract-view.js';

const generateFilterButtons = (filters, currentFilter) => filters.map(({ type }) => `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"
      ${type === currentFilter ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>
  `).join('');

const createFilterTemplate = (filters, currentFilter) => `
  <form class="trip-filters" action="#" method="get">
    ${generateFilterButtons(filters, currentFilter)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`;

export default class FilterView extends AbstractView {
  #filters = null;
  #onFilterChange = null;
  #currentFilter = null;

  constructor(filters, onFilterChange, currentFilterType) {
    super();
    this.#filters = filters;
    this.#onFilterChange = onFilterChange;
    this.#currentFilter = currentFilterType;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterChange(evt.target.value);
  };
}
