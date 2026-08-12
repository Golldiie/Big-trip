import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT'
};

export default class PointsApiService extends ApiService{

  constructor(endPoint, authorization) {
    super(endPoint, authorization);
  }

  get points() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  async updatePoint(point){
    const response = await this._load({
      url: `point/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }
}
