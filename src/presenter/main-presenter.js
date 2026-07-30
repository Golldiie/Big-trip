import { render } from '../framework/render.js';
import Sort from '../view/sort.js';
import Filter from '../view/filter.js';
import { DEFAULT_SORT, MessageBoard } from '../const.js';
import { generateFilters } from '../mocks/filters.js';
import ListMessage from '../view/list-message.js';
import PointPresenter from './point-presenter.js';

export default class MainPresenter {
  #pointPresenters = new Map();

  constructor({ filtersContainer, eventsContainer, tripModel }) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.tripModel = tripModel;
  }

  init() {
    this.#renderFilter();
    this.#renderSort();

    const pointsListElement = this.#createPointsList();

    if (!pointsListElement) {
      return;
    }

    this.#renderRoutePoints(pointsListElement);
  }

  #renderFilter() {
    const filters = generateFilters(this.tripModel.getPoints());
    render(new Filter({ filters }), this.filtersContainer);
  }

  #renderSort() {
    render(new Sort(DEFAULT_SORT), this.eventsContainer);
  }

  #createPointsList() {
    const points = this.tripModel.getPoints();

    if (points.length === 0) {
      render(
        new ListMessage({ message: MessageBoard.EMPTY_LIST }),
        this.eventsContainer
      );
      return null;
    }

    const pointsListElement = document.createElement('ul');
    pointsListElement.classList.add('trip-events__list');

    this.eventsContainer.append(pointsListElement);

    return pointsListElement;
  }

  #renderRoutePoints(container) {
    this.tripModel.getPoints().forEach((point) => {
      const pointPresenter = new PointPresenter({
        pointsContainer: container,
        tripModel: this.tripModel,
        onDataChange: this.#handlePointChange,
        onModeChange: this.#handleModeChange,
      });

      pointPresenter.init(point);

      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #handlePointChange = (updatedPoint) => {
    this.tripModel.updatePoint(updatedPoint);

    this.#pointPresenters
      .get(updatedPoint.id)
      .update(updatedPoint);
  };

  #handleModeChange = (currentPresenter) => {
    this.#pointPresenters.forEach((presenter) => {
      if (presenter !== currentPresenter) {
        presenter.resetView();
      }
    });
  };
}
