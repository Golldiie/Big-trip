import {render, replace, remove} from '../framework/render.js';
import RoutePoint from '../view/route-point.js';
import FormEditing from '../view/form-editing.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #pointsContainer = null;
  #tripModel = null;

  #routePointComponent = null;
  #formEditingComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor({pointsContainer, tripModel, onDataChange, onModeChange}) {
    this.#pointsContainer = pointsContainer;
    this.#tripModel = tripModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#routePointComponent, prevRoutePointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#formEditingComponent, prevFormEditingComponent);
    }
  }

  destroy() {
    remove(this.#routePointComponent);
    remove(this.#formEditingComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
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
      offersByType: this.#tripModel.getOffers(),
      selectedOffers: point.offers,
      destinations: this.#tripModel.getDestinations(),
    };
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }


  #replacePointToForm() {
    this.#handleModeChange(this);
    this.#mode = Mode.EDITING;
    replace(this.#formEditingComponent, this.#routePointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#routePointComponent, this.#formEditingComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
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

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToPoint();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };
}
