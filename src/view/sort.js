import { SortType, DEFAULT_SORT } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortingItemTemplate(type, currentSort){
  const isDisabled = type === 'event' || type === 'offers';
  return `<div class="trip-sort__item  trip-sort__item--${type}">
              <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${type === currentSort ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} data-sort-type="${type}">
              <label class="trip-sort__btn" for="sort-${type}">${type}</label>
            </div>`;
}

function createSortingTemplate(currentSort){
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${SortType.map((type) => createSortingItemTemplate(type, currentSort)).join('')}
  </form>`;
}

export default class Sort extends AbstractView{
  #currentSort = null;
  #handleSortTypeChange = null;

  constructor(currentSort = DEFAULT_SORT, {onSortTypeChange}) {
    super();
    this.#currentSort = currentSort;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template(){
    return createSortingTemplate(this.#currentSort);
  }

  #sortTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT'){
      return;
    }

    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
