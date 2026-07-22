import AbstractView from '../framework/view/abstract-view';

function createEmptyListMessageTemplate(message){
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class ListMessage extends AbstractView {
  #message = null;

  constructor({message}){
    super();
    this.#message = message;
  }

  get template(){
    return createEmptyListMessageTemplate(this.#message);
  }
}
