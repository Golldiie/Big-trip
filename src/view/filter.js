import { createElement } from '../render';

const FILTER_TYPES = ['Everything', 'Future', 'Present', 'Past'];

function createFilterItemTemplate(type){
  return `<div class="trip-filters__filter">
                  <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type.toLowerCase()}">
                  <label class="trip-filters__filter-label" for="filter-${type.toLowerCase()}">${type}</label>
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
