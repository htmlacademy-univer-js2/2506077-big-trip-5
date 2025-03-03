import { mockRoutePoints } from '../mock/task.js';

export default class RoutePointsModel {
  routePoints = mockRoutePoints;

  getRoutePoints() {
    return this.routePoints;
  }
}
