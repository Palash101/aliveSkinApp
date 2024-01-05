import {API_BASE} from '../config/ApiConfig';

export class VideoController {
  async AllVideos(token) {
    
    return fetch(API_BASE + '/videos', {
      headers: {
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

  async authAllVideos(token) {
    
    return fetch(API_BASE + '/auth/videos', {
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

  async videoDetail(id) {
    
    return fetch(API_BASE + '/videos/' + id + '/details', {
      headers: {
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


  async authVideoDetail(id,token) {
    
    return fetch(API_BASE + '/auth/videos/' + id + '/details', {
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


  async like(id, like, token) {
    const newdata = new FormData();
    newdata.append('like', like);
    console.log(newdata,token)
    return fetch(API_BASE + '/videos/' + id + '/viewed', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      method: 'POST',
      body: newdata
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

  async view(id, view, token) {
    const newdata = new FormData();
    newdata.append('view', view);

    return fetch(API_BASE + '/videos/' + id + '/viewed', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      method: 'POST',
      body: newdata
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
