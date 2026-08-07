import { render, replace, remove } from '../framework/render.js';
import Sort from '../view/sort.js';
import { filter } from '../utils/filters.js';
import { DEFAULT_SORT, MessageBoard } from '../const.js';
import ListMessage from '../view/list-message.js';
import PointPresenter from './point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import { sortByDate, sortByPrice, sortByTime } from '../utils/utils.js';

export default class MainPresenter {
  #pointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = DEFAULT_SORT;

  constructor({ filtersContainer, eventsContainer, tripModel, filterModel, }) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.tripModel = tripModel;
    this.filterModel = filterModel;

    this.filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.filterModel.filter;

    const filteredPoints = filter[filterType](this.tripModel.points);

    switch (this.#currentSortType) {
      case 'price':
        return [...filteredPoints].sort(sortByPrice);

      case 'time':
        return [...filteredPoints].sort(sortByTime);

      default:
        return [...filteredPoints].sort(sortByDate);
    }
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
    const filterPresenter = new FilterPresenter({
      filterContainer: this.filtersContainer,
      filterModel: this.filterModel,
      tripModel: this.tripModel,
    });

    filterPresenter.init();
  }

  #renderSort() {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new Sort(this.#currentSortType, {
      onSortTypeChange: this.#handleSortTypeChange,
    });

    if (prevSortComponent === null) {
      render(this.#sortComponent, this.eventsContainer);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearPoints();

    const pointsListElement = this.eventsContainer.querySelector('.trip-events__list');
    this.#renderRoutePoints(pointsListElement, this.points);
  };

  #createPointsList() {
    const points = this.points;

    if (points.length === 0) {
      const filterType = this.filterModel.filter;

      const messageByFilter = {
        everything: MessageBoard.EMPTY_LIST,
        future: MessageBoard.FUTURE,
        present: MessageBoard.PRESENT,
        past: MessageBoard.PAST,
      };

      render(
        new ListMessage({
          message: messageByFilter[filterType],
        }),
        this.eventsContainer
      );
    }

    const pointsListElement = document.createElement('ul');
    pointsListElement.classList.add('trip-events__list');

    this.eventsContainer.append(pointsListElement);

    return pointsListElement;
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });

    this.#pointPresenters.clear();

    const list = this.eventsContainer.querySelector('.trip-events__list');
    if (list) {
      list.remove();
    }

    const message = this.eventsContainer.querySelector('.trip-events__msg');
    if (message) {
      message.remove();
    }
  }

  #renderRoutePoints(container, points = this.points) {
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

  #handleModelEvent = () => {
    this.#currentSortType = DEFAULT_SORT;

    this.#renderSort();

    this.#clearPoints();

    const pointsListElement = this.#createPointsList();

    if (!pointsListElement) {
      return;
    }

    this.#renderRoutePoints(pointsListElement);
  };
}
