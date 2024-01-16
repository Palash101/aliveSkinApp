import {API_BASE} from '../config/ApiConfig';
import moment from 'moment';

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
    newdata.append('dob', moment(data.dob).format("YYYY-MM-DD"));
    newdata.append('gender', data.gender);
    if (data.image) {
      newdata.append('image', data.image);
    }
    if (data.email) {
      newdata.append('email', data.email);
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

  async allQuestions(token) {
    return fetch(API_BASE + '/questions', {
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
  
  async firebaseTokenUpdate(firebaseToken, token) {
    const newdata = new FormData();
    newdata.append('token', firebaseToken);
    return fetch(API_BASE + '/auth/token/update', {
      method: 'POST',
      body: newdata,
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson, 'reee');
        return responseJson;
      })
      .catch(error => {
        console.log(error);
        return {success: false, error};
      });
  }

}
