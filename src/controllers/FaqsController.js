import {API_BASE} from '../config/ApiConfig';

export class FaqsController {
  async AllFaqs() {
    
    return fetch(API_BASE + '/faqs', {
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


}
