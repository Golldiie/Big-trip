import AbstractView from '../framework/view/abstract-view.js';
import { capitalize, humanizeFormDate } from '../utils/utils.js';
import { createEventTypeListTemplate, createDestinationsListTemplate, createDestinationTemplate } from '../utils/forms.js';

function createOfferItemTemplate(offer, selectedOffers) {
  const isChecked = selectedOffers.includes(offer.id);

  return `
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${offer.id}"
        type="checkbox"
        ${isChecked ? 'checked' : ''}
      >
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        +€&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `;
}

function createOffersTemplate(offers, selectedOffers) {
  return offers
    .map((offer) => createOfferItemTemplate(offer, selectedOffers))
    .join('');
}

function createFormEditingTemplate(point, destination, offers, selectedOffers, destinations){
  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${point.id}" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeListTemplate()}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
                      ${capitalize(point.type)}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${point.id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${point.id}">
                    <datalist id="destination-list-${point.id}">
                      ${createDestinationsListTemplate(destinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${point.id}" type="text" name="event-start-time" value="${humanizeFormDate(point.dateFrom)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${point.id}" type="text" name="event-end-time" value="${humanizeFormDate(point.dateTo)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${point.id}">
                      <span class="visually-hidden">Price</span>
                       &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${point.id}" type="text" name="event-price" value="${point.basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                      ${createOffersTemplate(offers, selectedOffers)}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    ${createDestinationTemplate(destination)}
                  </section>
                </section>
              </form>`;
}

export default class FormEditing extends AbstractView{
  #point = null;
  #destination = null;
  #offers = null;
  #selectedOffers = null;
  #destinations = null;

  constructor({point,
    destination,
    offers,
    selectedOffers,
    destinations,
    onFormSubmit,
    onRollupClick}){
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#selectedOffers = selectedOffers;
    this.#destinations = destinations;


    this._callback.formSubmit = onFormSubmit;
    this._callback.rollupClick = onRollupClick;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);

    this.element.addEventListener('submit', this.#formSubmitHandler);
  }

  get template(){
    return createFormEditingTemplate(this.#point, this.#destination, this.#offers, this.#selectedOffers, this.#destinations);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  };
}
