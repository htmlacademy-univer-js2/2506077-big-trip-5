import { render, replace } from '../framework/render.js';
import RoutePointView from '../view/route-point-view.js';
import CreateEditEventView from '../view/create-event-form-view.js';
import { isEscapeKey } from '../utils.js';
import { Mode } from '../const.js';

export default class RoutePointPresenter {
  #eventsListContainer = null;
  #routePoint = null;
  #point = null;
  #editPoint = null;
  #onDataChange = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;

  constructor(eventsListContainer, onDataChange, onModeChange) {
    this.#eventsListContainer = eventsListContainer;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(routePoint) {
    this.#routePoint = routePoint;
    this.#renderRoutePoint();
  }

  #renderRoutePoint() {
    this.#point = new RoutePointView(
      this.#routePoint,
      this.#onOpenEditButtonClick,
      this.#onFavoriteClick.bind(this)
    );
    this.#editPoint = new CreateEditEventView(this.#routePoint, this.#onCloseEditButtonClick, this.#onSubmitButtonClick);
    render(this.#point, this.#eventsListContainer);
  }

  #updateRoutePoint() {
    const newPoint = new RoutePointView(
      this.#routePoint,
      this.#onOpenEditButtonClick,
      this.#onFavoriteClick.bind(this)
    );
    replace(newPoint, this.#point);
    this.#point = newPoint;
  }

  #onFavoriteClick(routePoint) {
    routePoint.isFavorite = !routePoint.isFavorite;
    this.#onDataChange(routePoint);
    this.#updateRoutePoint();
  }

  #onEscKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      this.#replaceEditPointToPoint();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onOpenEditButtonClick = () => {
    this.#replacePointToEditPoint();
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #onCloseEditButtonClick = () => {
    this.#replaceEditPointToPoint();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onSubmitButtonClick = () => {
    this.#replaceEditPointToPoint();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #replacePointToEditPoint() {
    if (!this.#point.element.parentElement) {
      return;
    }

    replace(this.#editPoint, this.#point);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditPointToPoint() {
    if (!this.#editPoint.element.parentElement) {
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
