import { capitalize } from '../utils/utils';
import { EVENT_TYPES } from '../const';

function createEventItemTemplate(type){
  return `<div class="event__type-item">
    <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${capitalize(type)}</label>
  </div>`;
}

export function createEventTypeListTemplate() {
  return EVENT_TYPES.map((type) => createEventItemTemplate(type)).join('');
}

function createOfferItemTemplate(offer){
  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}">
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
}

export function createOffersTemplate(offers){
  return offers.map((offer) => createOfferItemTemplate(offer)).join('');
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

  let pictures = '';

  if (!destination.pictures){
    pictures = '';
  } else {
    pictures = `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPicturesTemplate(destination.pictures)}
        </div>
      </div>`;
  }
  return `<p class="event__destination-description">
        ${destination.description}
      </p>
      ${pictures}
    </section>`;
}
