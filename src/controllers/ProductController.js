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


  async productByName(name) {
    return fetch(API_BASE + `/products/${name}/byName`, {
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

  async getRewards(token) {

    return fetch(API_BASE + '/rewards', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      method: 'GET',
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
    return fetch(API_BASE + '/user/recomendation', {
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
    let str = 'limit=10&orderBy=asc&brand_id=' + brandid;
    console.log(API_BASE + `/products?${str}`,'urlll')
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
    // console.log(JSON.stringify(data), token);

    return fetch(API_BASE + '/order', {
      headers: {
        // Authorization: 'Bearer ' + token,
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

  async allAddress(token) {
    console.log(token);
    return fetch(API_BASE + '/user/address', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
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

  async addAddress(data, token) {
    console.log(data, token);

    return fetch(API_BASE + '/user/address', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'POST',
      body: data,
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

  async updateAddress(data, id, token) {
    return fetch(API_BASE + `/user/address/${id}/update`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'POST',
      body: data,
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

  async deleteAddress(id, token) {
    return fetch(API_BASE + `/user/address/${id}/delete`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      method: 'POST',
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

  async productHistory(token) {
    return fetch(API_BASE + '/order', {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      method: 'GET',
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

  async cancelOrder(notes, id, token) {
    const newdata = new FormData();
    newdata.append('type', 'Cancelled');
    newdata.append('notes', notes);

    return fetch(API_BASE + `/order/change/${id}/status`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
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
}
