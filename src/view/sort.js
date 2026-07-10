import { createElement } from '../render.js';
const sortTypes = ['Day', 'Event', 'Time', 'Price', 'Offers'];

function createSortingItemTemplate(type){
  return `<div class="trip-sort__item  trip-sort__item--day">
              <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" checked>
              <label class="trip-sort__btn" for="sort-${type}">${type}</label>
            </div>`;
}

function createSortingTemplate(){
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${sortTypes.map((type) => createSortingItemTemplate(type)).join('')}
  </form>`;
}

export default class Sorting {
  getTemplate(){
    return createSortingTemplate();
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
