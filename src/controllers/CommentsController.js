import {API_BASE} from '../config/ApiConfig';

export class CommentsController {
  async PostComment(id, type, comments, token) {
    const newdata = new FormData();
    newdata.append('type', type);
    newdata.append('comments', comments);

    return fetch(API_BASE + `/comments/${id}/add`, {
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
}
