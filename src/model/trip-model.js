import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';


export default class TripModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];

  #pointsApiService = null;

  constructor({pointsApiService}){
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#pointsApiService.points,
        this.#pointsApiService.destinations,
        this.#pointsApiService.offers,
      ]);

      this.#points = points.map(this.#adaptToClient);
      this.#destinations = destinations;
      this.#offers = offers;
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  setPoints(points){
    this.#points = points;
  }

  getOffers = () => this.#offers;
  getDestinations = () => this.#destinations;

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

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex(
      (point) => point.id === updatedPoint.id
    );

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(updatedPoint);
      const updatedFromServer = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedFromServer,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedFromServer);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
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

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
