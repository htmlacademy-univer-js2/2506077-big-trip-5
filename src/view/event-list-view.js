import AbstractView from './abstract-view.js';

const createEventListTemplate = () => `
  <ul class="trip-events__list"></ul>
`;

export default class EventList extends AbstractView {
  getTemplate() {
    return createEventListTemplate();
  }
}
