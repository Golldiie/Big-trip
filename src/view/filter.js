import { createElement } from '../render';
import { FILTER_TYPES } from '../const';

function createFilterItemTemplate(type){
  return `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}">
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`;
}

function createFiltersTemplate(){
  return `<form class="trip-filters" action="#" method="get">
  ${FILTER_TYPES.map((type) => createFilterItemTemplate(type)).join('')}
  </form>`;
}

export default class Filter {
  getTemplate(){
    return createFiltersTemplate();
  }

  getElement(){
    if(!this.element){
      return createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement(){
    this.element = null;
  }
}
