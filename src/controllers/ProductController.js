import {API_BASE} from '../config/ApiConfig';

export class ProductContoller {
  async allProducts(name, page) {
    console.log(name, 'namename');
    let str = '';
    if (name && name != '') {
      str = 'name=' + name + '&';
    }
    str = str + 'limit=10&orderBy=asc&page=' + page;

    console.log(API_BASE + `/products?${str}`, 'ssss');

    return fetch(API_BASE + `/products?${str}`, {
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

  async searchProducts(name) {
    let str = '';
    if (name && name != '') {
      str = 'name=' + name + '&';
    }
    str = str + 'limit=10&orderBy=asc';

    return fetch(API_BASE + `/products?${str}`, {
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

  async recommandProducts(token) {
    return fetch(API_BASE + `/user/recomendation`, {
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

  async productDetail(id) {
    return fetch(API_BASE + `/products/${id}/details`, {
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

  async checkCode(id, code) {

    const newdata = new FormData();
    newdata.append('code', code);

    return fetch(API_BASE + `/products/${id}/code/check`, {
      headers: {
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

  async category() {
    return fetch(API_BASE + '/category/top', {
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

  async brands() {
    return fetch(API_BASE + '/brands', {
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

  async productsByBrand(brandid) {
    console.log(brandid, 'brandid');
    let str = 'name=limit=10&orderBy=asc&brand_id=' + brandid;

    return fetch(API_BASE + `/products?${str}`, {
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

  async checkout(data, token) {
    console.log(JSON.stringify(data), token);

    return fetch(API_BASE + '/order', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        return responseJson;
      })
      .catch(error => {
        console.log(error);
        return {success: false, error};
      });
  }
}
