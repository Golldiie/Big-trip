import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { capitalize, humanizeFormDate } from '../utils/utils.js';
import { createEventTypeListTemplate, createOffersTemplate, createDestinationsListTemplate, createDestinationTemplate } from '../utils/forms.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';


function createFormCreationTemplate(type, destination, offers, selectedOffers, destinations, dateFrom, dateTo, basePrice){
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
          ${createEventTypeListTemplate(type)}
      </fieldset>
    </div>
    </div>

  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">${capitalize(type)}</label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-1">
    <datalist id="destination-list-1">
      ${createDestinationsListTemplate(destinations)}
    </datalist>
  </div>

  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeFormDate(dateFrom)}">&mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeFormDate(dateTo)}">
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>&euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
  </div>

  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Cancel</button>
  </header>

  <section class="event__details">
    ${createOffersTemplate(offers, selectedOffers)}

    ${createDestinationTemplate(destination)}
  </section>
  </form>
  </li>`;
}

export default class FormCreation extends AbstractStatefulView {
  #datepicker = [];

  constructor({offersByType, destinations, onFormSubmit, onCancel}) {
    super();

    const type = offersByType[0].type;
    const destination = destinations[0];

    this._setState({
      type,
      destination,
      offersByType,
      offers: offersByType[0].offers,
      selectedOffers: [],
      destinations,
      dateFrom: new Date(),
      dateTo: new Date(),
      basePrice: 0,
    });

    this._callback.formSubmit = onFormSubmit;
    this._callback.cancel = onCancel;

    this._restoreHandlers();
  }

  get template() {
    return createFormCreationTemplate(
      this._state.type,
      this._state.destination,
      this._state.offers,
      this._state.selectedOffers,
      this._state.destinations,
      this._state.dateFrom,
      this._state.dateTo,
      this._state.basePrice
    );
  }

  _restoreHandlers = () => {
    this.element
      .querySelector('.event__type-list')
      .addEventListener('change', this.#typeChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('[name="event-price"]')
      .addEventListener('input', this.#priceChangeHandler);
    this.element
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#cancelClickHandler);

    this.element
      .querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);
    this.#setDatepicker();
  };

  removeElement() {
    super.removeElement();

    this.#datepicker.forEach((datepicker) => datepicker.destroy());
    this.#datepicker = [];
  }

  #setDatepicker() {
    this.#datepicker = [
      flatpickr(
        this.element.querySelector('[name="event-start-time"]'),
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          defaultDate: this._state.dateFrom,
          onChange: this.#dateFromChangeHandler,
        }
      ),

      flatpickr(
        this.element.querySelector('[name="event-end-time"]'),
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          defaultDate: this._state.dateTo,
          onChange: this.#dateToChangeHandler,
        }
      ),
    ];
  }

  #typeChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__type-input')) {
      return;
    }

    const type = evt.target.value;

    const offerGroup = this._state.offersByType.find(
      (item) => item.type === type
    );

    this.updateElement({
      type,
      offers: offerGroup?.offers ?? [],
      selectedOffers: [],
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #destinationChangeHandler = (evt) => {
    const destinationName = evt.target.value.trim();

    const destination = this._state.destinations.find(
      (item) => item.name === destinationName
    );

    if (!destination) {
      return;
    }

    this.updateElement({
      destination,
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  #offerChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const offerId = evt.target.value;

    const selectedOffers = evt.target.checked
      ? [...this._state.selectedOffers, offerId]
      : this._state.selectedOffers.filter((id) => id !== offerId);

    this.updateElement({
      selectedOffers,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    const point = {
      id: crypto.randomUUID(),
      type: this._state.type,
      destination: this._state.destination.id,
      dateFrom: this._state.dateFrom,
      dateTo: this._state.dateTo,
      basePrice: this._state.basePrice,
      offers: this._state.selectedOffers,
      isFavorite: false,
    };

    this._callback.formSubmit(point);
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.cancel();
  };
}
