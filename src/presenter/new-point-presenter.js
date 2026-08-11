import { remove, render, RenderPosition } from '../framework/render.js';
import FormCreation from '../view/form-creation.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #tripModel = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor({
    pointListContainer,
    tripModel,
    onDataChange,
    onDestroy,
  }) {
    this.#pointListContainer = pointListContainer;
    this.#tripModel = tripModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new FormCreation({
      offersByType: this.#tripModel.getOffers(),
      destinations: this.#tripModel.getDestinations(),
      onFormSubmit: this.#handleFormSubmit,
      onCancel: this.#handleCancelClick,
    });

    render(
      this.#pointEditComponent,
      this.#pointListContainer,
      RenderPosition.AFTERBEGIN
    );

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );

    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
