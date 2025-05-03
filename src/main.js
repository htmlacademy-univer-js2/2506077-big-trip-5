import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePointsModel from './model/route-point-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';

const routePointsModel = new RoutePointsModel();
const filterModel = new FilterModel();
const newPointButton = new NewPointButtonPresenter(
  document.querySelector('.trip-main')
);

const tripPresenter = new TripPresenter(
  routePointsModel,
  filterModel,
  newPointButton
);

const handleNewPointPuttonClick = () => {
  tripPresenter.createPoint();
  newPointButton.disableButton();
};

new FilterPresenter(
  document.querySelector('.trip-controls__filters'),
  filterModel,
  routePointsModel
).init();

newPointButton.init(handleNewPointPuttonClick);
tripPresenter.init();
