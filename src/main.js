import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import MainPresenter from './presenter/main-presenter.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATON = 'Basic zL3atSA04wol5de2s';
const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';

const newPointButtonContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const tripModel = new TripModel({pointsApiService: new PointsApiService(END_POINT, AUTHORIZATON)});
const filterModel = new FilterModel();

const presenter = new MainPresenter({
  filtersContainer,
  eventsContainer,
  newPointButtonContainer,
  tripModel,
  filterModel,
});

presenter.init();
