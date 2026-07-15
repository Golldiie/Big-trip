import { createElement } from '../render';
import { capitalize, humanizeDate, getClassDate, getEventDuration, humanizeTime, getFullIsoDate } from '../utils/utils';

function createSelectedOfferTemplate(offer){
  return `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>`;
}

function createSelectedOffersTemplate(offers) {
  return offers.map((offer) => createSelectedOfferTemplate(offer)).join('');
}

function createRoutePointTemplate(point){
  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${getClassDate(point.dateFrom)}">${humanizeDate(point.dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${capitalize(point.type)} ${capitalize(point.destination.name)}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${getFullIsoDate(point.dateFrom)}">${humanizeTime(point.dateFrom)}</time>
            &mdash;
          <time class="event__end-time" datetime="${getFullIsoDate(point.dateTo)}">${humanizeTime(point.dateTo)}</time>
        </p>
        <p class="event__duration">${getEventDuration(point.dateFrom, point.dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${createSelectedOffersTemplate(point.offers)}
      </ul>
      <button class="event__favorite-btn event__favorite-btn" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
`;
}

export default class RoutePoint {
  constructor(point) {
    this.point = point;
  }

  getTemplate(){
    return createRoutePointTemplate(this.point);
  }

  getElement(){
    if(!this.element){
      return createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement(){
    this.element = null;
  }
}

