import { SORT_TYPES } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils/utils.js';

function createSortingItemTemplate(type){
  return `<div class="trip-sort__item  trip-sort__item--${type}">
              <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}">
              <label class="trip-sort__btn" for="sort-${type}">${capitalize(type)}</label>
            </div>`;
}

function createSortingTemplate(){
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${SORT_TYPES.map((type) => createSortingItemTemplate(type)).join('')}
  </form>`;
}

export default class Sort extends AbstractView{
  get template(){
    return createSortingTemplate();
  }
}
