import { mockRoutePoints } from '../mock/mock-route-data.js';

export default class RoutePointsModel {
  routePoints = mockRoutePoints;

  getRoutePoints() {
    return this.routePoints;
  }
}
