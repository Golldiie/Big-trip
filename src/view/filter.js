import { FILTER_TYPES } from '../const';
import AbstractView from '../framework/view/abstract-view';

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

export default class Filter extends AbstractView{
  get template(){
    return createFiltersTemplate();
  }
}
