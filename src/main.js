import TripModel from './model/trip-model.js';
import MainPresenter from './presenter/main-presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const tripModel = new TripModel();

const presenter = new MainPresenter({
  filtersContainer,
  eventsContainer,
  tripModel,
});

presenter.init();
