import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import MainPresenter from './presenter/main-presenter.js';


const newPointButtonContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const tripModel = new TripModel();
const filterModel = new FilterModel();

const presenter = new MainPresenter({
  filtersContainer,
  eventsContainer,
  newPointButtonContainer,
  tripModel,
  filterModel,
});

presenter.init();
