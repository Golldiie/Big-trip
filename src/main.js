import TripModel from './model/trip-model';
import MainPresenter from './presenter/main-presenter';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const tripModel = new TripModel();

const presenter = new MainPresenter({filtersContainer, eventsContainer});

presenter.init();
