import AbstractView from '../framework/view/abstract-view';
import { createEventTypeListTemplate, createOffersTemplate, createDestinationsListTemplate, createDestinationTemplate } from '../utils/forms.js';


function createFormCreationTemplate(offers, destinations){
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
      </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
          ${createEventTypeListTemplate()}
      </fieldset>
    </div>
    </div>

  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">Flight</label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
    <datalist id="destination-list-1">
      ${createDestinationsListTemplate(destinations)}
    </datalist>
  </div>

  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">&mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>&euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
  </div>

  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Cancel</button>
  </header>

  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${createOffersTemplate(offers)}
      </div>
    </section>

    ${createDestinationTemplate()}
  </section>
  </form>
  </li>`;
}

export default class FormCreation extends AbstractView{
  #offers = null;
  #destinations = null;

  constructor({offers, destinations}) {
    super();
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template(){
    return createFormCreationTemplate(this.#offers, this.#destinations);
  }
}
