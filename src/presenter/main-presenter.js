import { render, RenderPosition } from '../render.js';
import Sort from '../view/sort.js';
import Filter from '../view/filter.js';
import FormCreation from '../view/form-creation.js';
import RoutePoint from '../view/route-point.js';


export default class MainPresenter {
  constructor({filtersContainer, eventsContainer, tripModel}) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.tripModel = tripModel;
  }

  init(){
    render(new Filter(), this.filtersContainer);
    render(new Sort(), this.eventsContainer);
    const pointsListElement = document.createElement('ul');
    pointsListElement.classList.add('trip-events__list');

    this.eventsContainer.append(pointsListElement);
    render(new FormCreation({offers: this.tripModel.getOfferByType('flight').offers, destinations: this.tripModel.getDestinations()}), pointsListElement, RenderPosition.AFTERBEGIN);

    const points = [...this.tripModel.getPoints()];
    points.forEach((point) => {
      const destination = this.tripModel.getDestinationById(point.destination);

      const offers = this.tripModel.getOfferById(point.type, point.offers);

      render(
        new RoutePoint({
          ...point,
          destination,
          offers
        }),
        pointsListElement
      );
    });
  }
}
