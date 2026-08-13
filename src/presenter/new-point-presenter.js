import { remove, render, RenderPosition } from '../framework/render.js';
import FormCreation from '../view/form-creation.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #tripModel = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #formCreationComponent = null;

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
    if (this.#formCreationComponent !== null) {
      return;
    }

    this.#formCreationComponent = new FormCreation({
      offersByType: this.#tripModel.getOffers(),
      destinations: this.#tripModel.getDestinations(),
      onFormSubmit: this.#handleFormSubmit,
      onCancel: this.#handleCancelClick,
    });

    render(
      this.#formCreationComponent,
      this.#pointListContainer,
      RenderPosition.AFTERBEGIN
    );

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#formCreationComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#formCreationComponent);
    this.#formCreationComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#formCreationComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#formCreationComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#formCreationComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
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
