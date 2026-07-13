import { mockPoints } from '../mocks/points';
import { mockOffers } from '../mocks/offers';
import { mockDestinations } from '../mocks/destinations';

export default class TripModel {
  points = mockPoints;
  offers = mockOffers;
  destinations = mockDestinations;

  getPoints = () => this.points;
  getOffers = () => this.offers;
  getDestinations = () => this.destinations;
}
