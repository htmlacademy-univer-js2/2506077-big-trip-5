import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePointsModel from './model/route-point-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import PointsApiService from './service/api-service.js';
import { END_POINT, AUTHORIZATION } from './const.js';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const routePointsModel = new RoutePointsModel(pointsApiService);
const filterModel = new FilterModel();
const newPointButton = new NewPointButtonPresenter(
  document.querySelector('.trip-main')
);

routePointsModel.init();

const filterPresenter = new FilterPresenter(
  document.querySelector('.trip-controls__filters'),
  filterModel,
  routePointsModel
);

new TripPresenter(
  routePointsModel,
  filterModel,
  newPointButton,
  filterPresenter
).init();
