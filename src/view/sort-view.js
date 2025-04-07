import AbstractView from '../framework/view/abstract-view.js';

const generateSortButtons = (sort) => {
  const emptyList = sort.every((sortItem) => sortItem.isDisabled);

  return sort.map(({ type, isDisabled }) => `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${type}"
      ${!emptyList && type === 'day' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${type}" data-sort-type="${type}">${type}</label>
    </div>
  `).join('');
};

const createSortTemplate = (sort) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${generateSortButtons(sort)}
  </form>
`;

export default class SortView extends AbstractView {
  #sort = null;
  #onSortTypeChange = null;

  constructor(sort, onSortTypeChange) {
    super();
    this.#sort = sort;
    this.#onSortTypeChange = onSortTypeChange;

    this.#setEventListeners();
  }

  get template() {
    return createSortTemplate(this.#sort);
  }

  #setEventListeners() {
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    const label = evt.target.closest('.trip-sort__btn');
    if (!label) {
      return;
    }

    const sortType = label.dataset.sortType;
    const input = document.getElementById(`sort-${sortType}`);

    if (!input || input.disabled) {
      return;
    }

    this.#onSortTypeChange(sortType);
  };
}
