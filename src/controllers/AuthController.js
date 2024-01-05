import {API_BASE} from '../config/ApiConfig';

export class AuthContoller {
  async login(phonenumber, uid) {
    console.log(phonenumber, uid, 'phone');
    const newdata = new FormData();
    newdata.append('phone', phonenumber);
    newdata.append('uid', uid);
    return fetch(API_BASE + '/auth/login', {
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

  async profileUpdate(data, token) {
    const newdata = new FormData();

    newdata.append('name', data.name);
    newdata.append('dob', data.dob);
    newdata.append('gender', data.gender);
    if (data.image) {
      newdata.append('image', data.image);
    }

    console.log(newdata,'newdata')
    return fetch(API_BASE + '/auth/profile/update', {
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

  async profileDetails(token) {
    console.log(token)
    return fetch(API_BASE + '/auth/profile', {
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
