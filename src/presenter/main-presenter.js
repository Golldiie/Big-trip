import { render } from '../framework/render.js';
import Sort from '../view/sort.js';
import Filter from '../view/filter.js';
import RoutePoint from '../view/route-point.js';


export default class MainPresenter {
  constructor({filtersContainer, eventsContainer, tripModel}) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.tripModel = tripModel;
  }

  init() {
    this.#renderFilter();
    this.#renderSort();

    const pointsListElement = this.#createPointsList();

    this.#renderRoutePoints(pointsListElement);
  }

  #renderFilter() {
    render(new Filter(), this.filtersContainer);
  }

  #renderSort() {
    render(new Sort(), this.eventsContainer);
  }

  #createPointsList() {
    const pointsListElement = document.createElement('ul');
    pointsListElement.classList.add('trip-events__list');

    this.eventsContainer.append(pointsListElement);

    return pointsListElement;
  }

  #renderRoutePoints(container) {
    this.tripModel.getPoints().forEach((point) => {
      this.#renderRoutePoint(point, container);
    });
  }

  #preparePoint(point) {
    return {
      ...point,
      destination: this.tripModel.getDestinationById(point.destination),
      offers: this.tripModel.getOfferById(point.type, point.offers)
    };
  }

  #prepareEditingPoint(point) {
    return {
      point,
      destination: this.tripModel.getDestinationById(point.destination),
      offers: this.tripModel.getOfferById(point.type, point.offers),
      destinations: this.tripModel.getDestinations()
    };
  }

  #renderRoutePoint(point, container) {
    const routePointComponent = new RoutePoint(
      this.#preparePoint(point)
    );

    render(routePointComponent, container);
  }
}
