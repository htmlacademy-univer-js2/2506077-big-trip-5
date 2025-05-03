import { render, replace } from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import CreateEditEventView from '../view/create-event-form-view.js';
import { isEscapeKey } from '../utils.js';
import { Mode, UserAction, UpdateType, FormType } from '../const.js';

export default class RoutePointPresenter {
  #eventsListContainer = null;
  #routePoint = null;
  #point = null;
  #editPoint = null;
  #onDataChange = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;
  #isNewPointFormOpen = null;

  constructor(eventsListContainer, onDataChange, onModeChange, isNewPointFormOpen) {
    this.#eventsListContainer = eventsListContainer;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
    this.#isNewPointFormOpen = isNewPointFormOpen;
  }

  init(routePoint) {
    this.#routePoint = routePoint;
    this.#renderRoutePoint();
  }

  destroy() {
    if (this.#point) {
      this.#point.element.remove();
      this.#point = null;
    }
    if (this.#editPoint) {
      this.#editPoint.element.remove();
      this.#editPoint = null;
    }
  }

  #renderRoutePoint() {
    this.destroy();

    this.#point = new RoutePointView(
      this.#routePoint,
      this.#onOpenEditButtonClick,
      this.#onFavoriteClick.bind(this)
    );

    this.#editPoint = new CreateEditEventView(
      this.#routePoint,
      this.#onCloseEditButtonClick,
      this.#onSubmitButtonClick,
      this.#onDataChange,
      FormType.EDIT
    );

    render(this.#point, this.#eventsListContainer);
  }

  #onFavoriteClick(routePoint) {
    // eslint-disable-next-line camelcase
    routePoint.is_favorite = !routePoint.is_favorite;
    this.#onDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, routePoint);
  }

  #onEscKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      this.#replaceEditPointToPoint();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onOpenEditButtonClick = () => {
    if (!this.#isNewPointFormOpen()) {
      this.#replacePointToEditPoint();
      document.addEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onCloseEditButtonClick = () => {
    this.#replaceEditPointToPoint();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onSubmitButtonClick = () => {
    const updatedPoint = this.#editPoint.getUpdatedPoint();

    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      updatedPoint
    );

    this.init(updatedPoint);
    this.#replaceEditPointToPoint();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #isElementInDOM(element) {
    return element !== null && element.element && element.element.parentElement;
  }

  #replacePointToEditPoint() {
    if (!this.#isElementInDOM(this.#point)) {
      return;
    }

    replace(this.#editPoint, this.#point);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditPointToPoint() {
    if (!this.#isElementInDOM(this.#editPoint)) {
      return;
    }

    replace(this.#point, this.#editPoint);
    this.#mode = Mode.DEFAULT;
  }

  resetPointMode() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditPointToPoint();
    }
  }
}
