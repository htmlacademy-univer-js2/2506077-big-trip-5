import AbstractView from '../framework/view/abstract-view.js';

const generateSortButtons = (sort) => {
  const emptyList = sort.every((sortItem) => sortItem.isDisabled);

  return sort.map((sortItem) => `
    <div class="trip-sort__item  trip-sort__item--${sortItem.type}">
      <input id="sort-${sortItem.type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortItem.type}"
      ${!emptyList && sortItem.type === 'day' ? 'checked' : ''} ${sortItem.isDisabled ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${sortItem.type}">${sortItem.type}</label>
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
