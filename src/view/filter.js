import { FILTER_TYPES, DEFAULT_FILTER } from '../const';
import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(type, currentFilter){
  return `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilter ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`;
}

function createFiltersTemplate(currentFilter){
  return `<form class="trip-filters" action="#" method="get">
  ${FILTER_TYPES.map((type) => createFilterItemTemplate(type, currentFilter)).join('')}
  </form>`;
}

export default class Filter extends AbstractView{
  #currentFilter = null;

  constructor(currentFilter = DEFAULT_FILTER) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template(){
    return createFiltersTemplate(this.#currentFilter);
  }
}
