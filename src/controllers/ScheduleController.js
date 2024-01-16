import {API_BASE} from '../config/ApiConfig';

export class ScheduleController {
  async AllSchedule(token) {
    
    return fetch(API_BASE + '/schedules', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson, 'response');
        return responseJson;
      })
      .catch(error => {
        console.log(error);
        return {success: false, error};
      });
  }

  async bookNow(slot_id, package_id, type, token) {

    const newdata = new FormData();
    newdata.append('slot_id', slot_id);
    if(package_id){
      newdata.append('package_id', package_id);
    }
    newdata.append('type', type);
    console.log(newdata,'newdata')
    
    return fetch(API_BASE + '/booking', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      method: 'POST',
      body: newdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson, 'response');
        return responseJson;
      })
      .catch(error => {
        console.log(error);
        return {success: false, error};
      });
  }

  async allBookings(token) {

    return fetch(API_BASE + '/booking', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson, 'response');
        return responseJson;
      })
      .catch(error => {
        console.log(error);
        return {success: false, error};
      });
  }



}
