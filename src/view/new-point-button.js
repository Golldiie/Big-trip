import AbstractView from '../framework/view/abstract-view';

function createNewPointButtonTemplate(isDisabled){
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${isDisabled ? 'disabled' : ''}>New event</button>`;
}

export default class NewPointButton extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();

    this.#handleClick = onClick;

    this.element.addEventListener('click', this.#clickHandler);
  }

  get template(){
    return createNewPointButtonTemplate();
  }

  setDisabled(isDisabled) {
    this.element.disabled = isDisabled;
  }

  #clickHandler = () => {
    this.#handleClick();
  };
}
