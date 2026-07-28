import {render, replace} from '../framework/render.js';
import RoutePoint from '../view/route-point.js';
import FormEditing from '../view/form-editing.js';

export default class PointPresenter {
  #pointsContainer = null;
  #tripModel = null;

  #routePointComponent = null;
  #formEditingComponent = null;

  #point = null;

  constructor({pointsContainer, tripModel}) {
    this.#pointsContainer = pointsContainer;
    this.#tripModel = tripModel;
  }

  init(point) {
    this.#point = point;

    this.#routePointComponent = new RoutePoint({
      ...this.#preparePoint(point),
      onEditClick: this.#handleEditClick,
    });

    this.#formEditingComponent = new FormEditing({
      ...this.#prepareEditingPoint(point),
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
    });

    render(this.#routePointComponent, this.#pointsContainer);
  }

  #preparePoint(point) {
    return {
      point,
      destination: this.#tripModel.getDestinationById(point.destination),
      offers: this.#tripModel.getOfferById(point.type, point.offers),
    };
  }

  #prepareEditingPoint(point) {
    return {
      point,
      destination: this.#tripModel.getDestinationById(point.destination),
      offers: this.#tripModel.getOfferByType(point.type).offers,
      selectedOffers: point.offers,
      destinations: this.#tripModel.getDestinations(),
    };
  }

  #replacePointToForm() {
    replace(this.#formEditingComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#routePointComponent, this.#formEditingComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };
}
