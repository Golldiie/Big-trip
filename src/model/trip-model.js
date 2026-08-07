import Observable from '../framework/observable.js';
import { getRandomPoint } from '../mocks/points.js';
import { mockOffers } from '../mocks/offers.js';
import { mockDestinations } from '../mocks/destinations.js';

const POINT_COUNT = 4;

export default class TripModel extends Observable {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  offers = mockOffers;
  destinations = mockDestinations;

  get points() {
    return this.#points;
  }

  setPoints(points){
    this.points = points;
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
    this.points = this.points.filter(
      (point) => point.id !== pointToDelete.id
    );

    this._notify(updateType);
  }

  addPoint(updateType, point) {
    this.points = [point, ...this.points];

    this._notify(updateType);
  }
}
