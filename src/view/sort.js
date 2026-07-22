import { SORT_TYPES, DEFAULT_SORT } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortingItemTemplate(type, currentSort){
  return `<div class="trip-sort__item  trip-sort__item--${type}">
              <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${type === currentSort ? 'checked' : ''}>
              <label class="trip-sort__btn" for="sort-${type}">${type}</label>
            </div>`;
}

function createSortingTemplate(currtntSort){
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${SORT_TYPES.map((type) => createSortingItemTemplate(type, currtntSort)).join('')}
  </form>`;
}

export default class Sort extends AbstractView{
  #currentSort = null;

  constructor(currentSort = DEFAULT_SORT) {
    super();
    this.#currentSort = currentSort;
  }

  get template(){
    return createSortingTemplate(this.#currentSort);
  }
}
