import superagent from 'superagent';

/********************************************************************************
*         Synchronous                                                           *
********************************************************************************/

export const tokenSet = token => {
  return {
    type: 'TOKEN_SET',
    payload: token,
  };
};

export const tokenDestroy = () => {
  return {type: 'TOKEN_DESTROY'};
};

/********************************************************************************
*        Asynchronous                                                           *
********************************************************************************/

export const signupRequest = user => dispatch => {
  console.log('signing the hell up');
  return superagent.post(`${__API_URL__}/signup`)
    .send(user)
    .withCredentials()
    .then(res => {
      console.log(res);
      return handleToken(res, dispatch);
    })
    .catch(console.error);
};

export const loginRequest = user => dispatch => {
  return superagent.get(`${__API_URL__}/login`)
    .auth(user.username, user.password)
    .withCredentials()
    .then(res => {
      try{
        dispatch(tokenSet(res.text));
        localStorage.setItem('token', res.text);
        console.log('res',res);
        return res;
      } catch(error){ console.error;}
    })
    .catch(console.error);
};

const handleToken = (res, dispatch) => {
  dispatch(tokenSet(res.text));
  localStorage.setItem('token', res.text);
  return res;
};