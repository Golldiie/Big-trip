import { createElement } from '../render';

const POINTS = [
  {
    date: 'MAR 18',
    dateTime: '2019-03-18',
    type: 'taxi',
    destination: 'Amsterdam',
    startTime: '10:30',
    endTime: '11:00',
    duration: '30M',
    price: '20',
    isFavourite: true,
    offers: [
      {
        title: 'Order Uber',
        price: 20
      }
    ]
  },
  {
    date: 'MAR 18',
    dateTime: '2019-03-18',
    type: 'flight',
    destination: 'Flight Chamonix',
    startTime: '12:25',
    endTime: '13:35',
    duration: '01H 10M',
    price: '160',
    isFavourite: false,
    offers: [
      {
        title: 'Add luggage',
        price: 50
      },
      {
        title: 'Switch to comfort',
        price: 80
      }
    ]
  },
  {
    date: 'MAR 18',
    dateTime: '2019-03-18',
    type: 'drive',
    destination: 'Drive Chamonix',
    startTime: '14:30',
    endTime: '16:05',
    duration: '01H 35M',
    price: '160',
    isFavourite: true,
    offers: [
      {
        title: 'Rent a car',
        price: 200
      }
    ]
  }];

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
      <time class="event__date" datetime="${point.dateTime}">${point.date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">Check-in Chamonix</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${point.dateTime}T${point.startTime}">${point.startTime}</time>
            &mdash;
          <time class="event__end-time" datetime="${point.dateTime}T${point.endTime}">${point.endTime}</time>
        </p>
        <p class="event__duration">${point.duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${point.price}</span>
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

export { POINTS };
