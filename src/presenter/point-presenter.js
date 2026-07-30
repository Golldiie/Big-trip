import {render, replace} from '../framework/render.js';
import RoutePoint from '../view/route-point.js';
import FormEditing from '../view/form-editing.js';

export default class PointPresenter {
  #pointsContainer = null;
  #tripModel = null;

  #routePointComponent = null;
  #formEditingComponent = null;
  #handleDataChange = null;

  #point = null;

  constructor({pointsContainer, tripModel, onDataChange}) {
    this.#pointsContainer = pointsContainer;
    this.#tripModel = tripModel;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;

    this.#createComponents(point);

    render(this.#routePointComponent, this.#pointsContainer);
  }

  update(point) {
    this.#point = point;

    const prevRoutePointComponent = this.#routePointComponent;
    const prevFormEditingComponent = this.#formEditingComponent;

    this.#createComponents(point);

    replace(this.#routePointComponent, prevRoutePointComponent);

    if (prevFormEditingComponent.element.parentNode) {
      replace(this.#formEditingComponent, prevFormEditingComponent);
    }
  }

  #createComponents(point) {
    this.#routePointComponent = new RoutePoint({
      ...this.#preparePoint(point),
      onEditClick: this.#handleEditClick,
      onFavouriteClick: this.#handleFavouriteClick,
    });

    this.#formEditingComponent = new FormEditing({
      ...this.#prepareEditingPoint(point),
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
    });
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

  #handleFavouriteClick = (updatedPoint) => {
    this.#handleDataChange(updatedPoint);
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
