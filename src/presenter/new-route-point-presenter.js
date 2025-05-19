import CreateEditEventView from '../view/create-event-form-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, FormType, EmptyPoint } from '../const.js';
import { isEscapeKey } from '../utils.js';

export default class NewRoutePointPresenter {
  #formComponent = null;
  #container = null;
  #onDataChange = null;
  #onDestroy = null;
  #destinations = null;
  #offersByType = null;

  constructor(container, destinations, offers, onDataChange, onDestroy) {
    this.#container = container;
    this.#destinations = destinations;
    this.#offersByType = offers;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#formComponent !== null) {
      return;
    }

    this.#formComponent = new CreateEditEventView(
      { ...EmptyPoint },
      this.#destinations,
      this.#offersByType,
      this.destroy,
      this.#onFormSubmit,
      this.#onDataChange,
      FormType.CREATE
    );

    render(this.#formComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  destroy = () => {
    if (this.#formComponent === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#formComponent);
    this.#formComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  isFormOpen() {
    return this.#formComponent !== null;
  }

  #onFormSubmit = async () => {
    const newPoint = this.#formComponent.getUpdatedPoint();

    this.#formComponent.setSaving();

    try {
      await this.#onDataChange(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        { ...newPoint }
      );

      this.destroy();
    } catch (error) {
      this.#formComponent.setAborting();
    }
  };

  #onEscKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
