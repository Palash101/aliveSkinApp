import {API_BASE} from '../config/ApiConfig';

export class BlogsController {
  async AllBlogs() {
    
    return fetch(API_BASE + '/blogs', {
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

  async authAllBlogs(type,token) {
    
    return fetch(API_BASE + '/auth/blogs?type='+type, {
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

  async blogDetail(id) {
    
    return fetch(API_BASE + '/blogs/'+id+'/details', {
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

  async authBlogDetail(type,id,token) {
    
    return fetch(API_BASE + '/auth/blogs/'+id+'/details?type='+type, {
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

    return fetch(API_BASE + '/blogs/'+id+'/viewed', {
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

    return fetch(API_BASE + '/blogs/'+id+'/viewed', {
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
