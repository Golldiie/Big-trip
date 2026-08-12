import { render, replace, remove } from '../framework/render.js';
import Loading from '../view/loading.js';
import NewPointButton from '../view/new-point-button.js';
import NewPointPresenter from './new-point-presenter.js';
import Sort from '../view/sort.js';
import { filter } from '../utils/filters.js';
import { DEFAULT_SORT, MessageBoard, UserAction, UpdateType, FilterType } from '../const.js';
import ListMessage from '../view/list-message.js';
import PointPresenter from './point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import { sortByDate, sortByPrice, sortByTime } from '../utils/utils.js';

export default class MainPresenter {
  #pointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = DEFAULT_SORT;
  #newPointButton = null;
  #newPointPresenter = null;
  #loadingComponent = new Loading();
  #isLoading = true;

  constructor({
    filtersContainer,
    eventsContainer,
    tripModel,
    filterModel,
    newPointButtonContainer,
  }) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.tripModel = tripModel;
    this.filterModel = filterModel;
    this.newPointButtonContainer = newPointButtonContainer;

    this.filterModel.addObserver(this.#handleModelEvent);
    this.tripModel.addObserver(this.#handleModelEvent);
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
    this.#renderNewPointButton();
    this.#renderFilter();
    this.#renderSort();

    render(this.#loadingComponent, this.eventsContainer);
  }

  #renderNewPointButton() {
    this.#newPointButton = new NewPointButton({
      onClick: this.#handleNewPointButtonClick,
    });

    render(this.#newPointButton, this.newPointButtonContainer);
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

  #createNewPointPresenter() {
    let pointsListElement = this.eventsContainer.querySelector('.trip-events__list');

    if (!pointsListElement) {
      this.#clearPoints();
      pointsListElement = this.#createPointsList();
    }

    if (!pointsListElement) {
      return;
    }

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: pointsListElement,
      tripModel: this.tripModel,
      onDataChange: this.#handlePointChange,
      onDestroy: this.#handleNewPointDestroy,
    });

    this.#newPointPresenter.init();
  }

  #handleNewPointButtonClick = () => {
    if (this.#newPointPresenter !== null) {
      return;
    }

    this.#pointPresenters.forEach((presenter) => {
      presenter.resetView();
    });

    this.filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#currentSortType = DEFAULT_SORT;
    this.#renderSort();

    this.#createNewPointPresenter();
  };

  #handleNewPointDestroy = () => {
    this.#newPointPresenter = null;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearPoints();

    const pointsListElement = this.#createPointsList();

    if (!pointsListElement) {
      return;
    }

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

      return null;
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

  #handlePointChange = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.tripModel.updatePoint(updateType, update);
        break;

      case UserAction.DELETE_POINT:
        this.tripModel.deletePoint(updateType, update);
        break;

      case UserAction.ADD_POINT:
        this.tripModel.addPoint(updateType, update);
        break;
    }
  };

  #handleModeChange = (currentPresenter) => {
    this.#pointPresenters.forEach((presenter) => {
      if (presenter !== currentPresenter) {
        presenter.resetView();
      }
    });
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).update(data);
        break;

      case UpdateType.MINOR: {
        this.#clearPoints();

        const pointsListElement = this.#createPointsList();

        if (!pointsListElement) {
          return;
        }

        this.#renderRoutePoints(pointsListElement);
        break;
      }

      case UpdateType.MAJOR: {
        this.#currentSortType = DEFAULT_SORT;

        this.#renderSort();
        this.#clearPoints();

        const pointsListElement = this.#createPointsList();

        if (!pointsListElement) {
          return;
        }

        this.#renderRoutePoints(pointsListElement);
        break;
      }

      case UpdateType.INIT: {
        this.#isLoading = false;

        remove(this.#loadingComponent);

        this.#clearPoints();

        const pointsListElement = this.#createPointsList();

        if (!pointsListElement) {
          return;
        }

        this.#renderRoutePoints(pointsListElement);
        break;
      }
    }
  };
}
