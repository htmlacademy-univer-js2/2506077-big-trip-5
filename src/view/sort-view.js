import AbstractView from '../framework/view/abstract-view.js';

const generateSortButtons = (sort) => {
  const emptyList = sort.every((sortItem) => sortItem.isDisabled);

  return sort.map(({ type, isDisabled }) => `
    <div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}"
      ${!emptyList && type === 'day' ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${type}">${type}</label>
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

  constructor(sort) {
    super();
    this.#sort = sort;
  }

  get template() {
    return createSortTemplate(this.#sort);
  }
}
