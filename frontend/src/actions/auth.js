import superagent from 'superagent';
import * as utils from '../lib/util';

/********************************************************************************
*         Synchronous                                                           *
********************************************************************************/

export const login = token => {
  return {
    type: 'LOGIN',
    payload: token,
  };
};

export const logout = () => {
  utils.cookieDelete('chatToken');
  return {
    type: 'LOGOUT',
  };
};

/********************************************************************************
*        Asynchronous                                                           *
********************************************************************************/

export const signupRequest = user => dispatch => {
  return superagent.post(`${__API_URL__}/signup`)
    .send(user)
    .withCredentials()
    .then(res => {
      let token = utils.cookieFetch('chatToken');
      if (token) dispatch(login(token)); 
      return res;
    })
    .catch(console.error);
};

export const loginRequest = user => dispatch => {
  return superagent.get(`${__API_URL__}/login`)
    .auth(user.username, user.password)
    .withCredentials()
    .then(res => {
      let token = utils.cookieFetch('chatToken');
      if (token) dispatch(login(token)); 
      return res;
    })
    .catch(console.error);
};
