import { render, RenderPosition } from '../render.js';
import Sort from '../view/sort.js';
import Filter from '../view/filter.js';
import FormCreation from '../view/form-creation.js';
import RoutePoint, { POINTS } from '../view/route-point.js';

export default class MainPresenter {
  constructor({filtersContainer, eventsContainer}) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
  }

  init(){
    render(new Filter(), this.filtersContainer, RenderPosition.BEFOREEND);
    render(new Sort(), this.eventsContainer, RenderPosition.BEFOREEND);
    const pointsList = document.createElement('ul');
    pointsList.classList.add('trip-events__list');

    this.eventsContainer.append(pointsList);
    render(new FormCreation(), pointsList, RenderPosition.AFTERBEGIN);
    POINTS.forEach((point) => render(new RoutePoint(point), pointsList, RenderPosition.BEFOREEND));
  }
}
