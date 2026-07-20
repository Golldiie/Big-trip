import { render, replace } from '../framework/render.js';
import Sort from '../view/sort.js';
import Filter from '../view/filter.js';
import RoutePoint from '../view/route-point.js';
import FormEditing from '../view/form-editing.js';
import { DEFAULT_FILTER, DEFAULT_SORT } from '../const.js';

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
    render(new Filter(DEFAULT_FILTER), this.filtersContainer);
  }

  #renderSort() {
    render(new Sort(DEFAULT_SORT), this.eventsContainer);
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
      point,
      destination: this.tripModel.getDestinationById(point.destination),
      offers: this.tripModel.getOfferById(point.type, point.offers),
    };
  }

  #prepareEditingPoint(point) {
    return {
      point,
      destination: this.tripModel.getDestinationById(point.destination),
      offers: this.tripModel.getOfferByType(point.type).offers,
      selectedOffers: point.offers,
      destinations: this.tripModel.getDestinations(),
    };
  }

  #renderRoutePoint(point, container) {
    const routePointComponent = new RoutePoint({
      ...this.#preparePoint(point),
      onEditClick: () => replacePointToForm(),
    });

    const formEditingComponent = new FormEditing({
      ...this.#prepareEditingPoint(point),

      onFormSubmit: () => replaceFormToPoint(),
      onRollupClick: () => replaceFormToPoint(),
    });

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function replacePointToForm() {
      replace(formEditingComponent, routePointComponent);
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function replaceFormToPoint() {
      replace(routePointComponent, formEditingComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(routePointComponent, container);
  }
}
