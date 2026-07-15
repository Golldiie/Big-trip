import { getRandomPoint } from '../mocks/points';
import { mockOffers } from '../mocks/offers';
import { mockDestinations } from '../mocks/destinations';

const POINT_COUNT = 4;

export default class TripModel {
  points = Array.from({length: POINT_COUNT}, getRandomPoint);
  offers = mockOffers;
  destinations = mockDestinations;

  getPoints = () => this.points;
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
}
