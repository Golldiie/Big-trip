import { capitalize } from '../utils/utils.js';
import { EVENT_TYPES } from '../const.js';

function createEventItemTemplate(type, currentType){
  return `<div class="event__type-item">
    <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${capitalize(type)}</label>
  </div>`;
}

export function createEventTypeListTemplate(currentType) {
  return EVENT_TYPES.map((type) => createEventItemTemplate(type, currentType)).join('');
}

function createOfferItemTemplate(offer, selectedOffers = []) {
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

export function createOffersTemplate(offers, selectedOffers = []){
  if(!offers || !offers.length){
    return '';
  }

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offers.map((offer) => createOfferItemTemplate(offer, selectedOffers)).join('')}
    </div>
  </section>`;
}

function createDestinationOptionTemplate(destination) {
  return `<option value="${destination.name}"></option>`;
}


export function createDestinationsListTemplate(destinations) {
  return destinations.map(createDestinationOptionTemplate).join('');
}


function createPictureTemplate(picture) {
  return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
}

export function createPicturesTemplate(pictures) {
  return pictures.map(createPictureTemplate).join('');
}

export function createDestinationTemplate(destination) {
  if (!destination) {
    return '';
  }

  const hasDescription = destination.description;
  const hasPictures = destination.pictures && destination.pictures.length;

  if (!hasDescription && !hasPictures) {
    return '';
  }

  let pictures = '';

  if (hasPictures) {
    pictures = `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPicturesTemplate(destination.pictures)}
        </div>
      </div>
    `;
  }

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">
        Destination
      </h3>

      ${hasDescription ? `
        <p class="event__destination-description">
          ${destination.description}
        </p>
      ` : ''}

      ${pictures}
    </section>
  `;
}
