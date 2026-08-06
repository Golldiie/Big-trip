import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { capitalize, humanizeFormDate } from '../utils/utils.js';
import { createEventTypeListTemplate, createDestinationsListTemplate, createDestinationTemplate } from '../utils/forms.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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

function createOffersTemplate(offers, selectedOffers){
  if(!offers.length){
    return '';
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offers.map((offer) => createOfferItemTemplate(offer, selectedOffers)).join('')}
    </div>
  </section>`;
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
            ${createEventTypeListTemplate(point.type)}
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
                  ${createOffersTemplate(offers, selectedOffers)}

                  ${createDestinationTemplate(destination)}
                </section>
              </form>`;
}

export default class FormEditing extends AbstractStatefulView{
  #datepicker = null;

  constructor({point, destination, offers, offersByType, selectedOffers, destinations, onFormSubmit, onRollupClick}){
    super();
    this._setState(FormEditing.parsePointToState({
      point,
      destination,
      offers,
      offersByType,
      selectedOffers,
      destinations,
    }));


    this._callback.formSubmit = onFormSubmit;
    this._callback.rollupClick = onRollupClick;
    this._restoreHandlers();
  }

  _restoreHandlers = () => {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);

    this.element
      .addEventListener('submit', this.#formSubmitHandler);

    this.element
      .querySelector('.event__type-list')
      .addEventListener('change', this.#typeChangeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.#setDatepicker();
  };

  get template(){
    return createFormEditingTemplate(this._state.point, this._state.destination, this._state.offers, this._state.selectedOffers, this._state.destinations);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(point){
    this.updateElement(FormEditing.parsePointToState(point));
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
      point: {
        ...this._state.point,
        type,
      },

      offers: offerGroup?.offers ?? [],
      selectedOffers: [],
    });
  };

  #setDatepicker() {
    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.point.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }
    );

    flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.point.dateTo,
        onChange: this.#dateToChangeHandler,
      }
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      },
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate,
      },
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

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(FormEditing.parseStateToPoint(this._state));
  };

  static parsePointToState(data){
    return {...data };
  }

  static parseStateToPoint(state) {
    return {
      ...state.point,
      offers: state.selectedOffers,
    };
  }
}
