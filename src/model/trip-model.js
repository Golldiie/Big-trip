import Observable from '../framework/observable.js';
import { getRandomPoint } from '../mocks/points.js';
import { mockOffers } from '../mocks/offers.js';
import { mockDestinations } from '../mocks/destinations.js';

const POINT_COUNT = 4;

export default class TripModel extends Observable {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  offers = mockOffers;
  destinations = mockDestinations;

  #pointsApiService = null;

  constructor({pointsApiService}){
    super();
    this.#pointsApiService = pointsApiService;
    this.#pointsApiService.points.then((points) => console.log(points.map(this.#adaptToClient)));
  }

  get points() {
    return this.#points;
  }

  setPoints(points){
    this.#points = points;
  }

  getOffers = () => this.offers;
  getDestinations = () => this.destinations;

  getDestinationById(id){
    const allDestinations = this.getDestinations();
    return allDestinations.find((item) => item.id === id);
  }

  getOfferByType(type){
    const allOffers = this.getOffers();
    return allOffers.find((item) => item.type === type);
  }

  getOfferById(type, itemsId){
    const offersType = this.getOfferByType(type);
    return offersType.offers.filter((item) => itemsId.find((id) => item.id === id));
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex(
      (point) => point.id === updatedPoint.id
    );

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points[index] = updatedPoint;
    this._notify(updateType, updatedPoint);
  }

  deletePoint(updateType, pointToDelete) {
    this.#points = this.#points.filter(
      (point) => point.id !== pointToDelete.id
    );

    this._notify(updateType);
  }

  addPoint(updateType, point) {
    this.#points = [point, ...this.#points];

    this._notify(updateType);
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
