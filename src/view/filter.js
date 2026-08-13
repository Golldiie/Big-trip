import { DEFAULT_FILTER } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType){
  const {type, count} = filter;
  const isDisabled = count === 0;

  return `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`;
}

function createFiltersTemplate(filterItems, currentFilterType){
  return `<form class="trip-filters" action="#" method="get">
  ${filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('')}
  </form>`;
}

export default class Filter extends AbstractView{
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType = DEFAULT_FILTER, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template(){
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT'){
      return;
    }

    this.#handleFilterTypeChange(evt.target.value);
  };
}
