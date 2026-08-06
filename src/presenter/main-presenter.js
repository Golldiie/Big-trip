import { render, replace} from '../framework/render.js';
import Sort from '../view/sort.js';
import Filter from '../view/filter.js';
import { DEFAULT_SORT, MessageBoard } from '../const.js';
import { generateFilters } from '../mocks/filters.js';
import ListMessage from '../view/list-message.js';
import PointPresenter from './point-presenter.js';
import { sortByDate, sortByPrice, sortByTime } from '../utils/utils.js';

export default class MainPresenter {
  #pointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = DEFAULT_SORT;
  #points = [];

  constructor({ filtersContainer, eventsContainer, tripModel }) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.tripModel = tripModel;
  }

  get points(){
    return this.tripModel.points;
  }

  init() {
    this.#points = [...this.tripModel.getPoints()].sort(sortByDate);
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
    this.#sortComponent = new Sort(DEFAULT_SORT, {
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.eventsContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    const prevSortComponent = this.#sortComponent;

    this.#currentSortType = sortType;

    switch (sortType) {
      case 'price':
        this.#points = [...this.#points].sort(sortByPrice);
        break;

      case 'time':
        this.#points = [...this.#points].sort(sortByTime);
        break;

      case 'day':
        this.#points = [...this.#points].sort(sortByDate);
        break;
    }

    this.#sortComponent = new Sort(this.#currentSortType, {
      onSortTypeChange: this.#handleSortTypeChange,
    });

    replace(this.#sortComponent, prevSortComponent);

    this.#clearPoints();

    const pointsListElement = this.eventsContainer.querySelector('.trip-events__list');

    this.#renderRoutePoints(pointsListElement, this.#points);
  };

  #createPointsList() {
    const points = this.#points;

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

  #clearPoints(){
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });

    this.#pointPresenters.clear();

    this.eventsContainer
      .querySelector('.trip-events__list')
      .innerHTML = '';
  }

  #renderRoutePoints(container, points = this.#points) {
    points.forEach((point) => {
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
