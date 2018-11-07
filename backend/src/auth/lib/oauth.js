'use strict';

import superagent from 'superagent';
import User from '../model.js';

const authorize = (req) => {
  let code = req.query.code;
  console.log('step 1: code', code);

  return superagent.post('https://www.googleapis.com/oauth2/v4/token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    })
    .then(res => {
      let googleToken = res.body.access_token;
      console.log('step 2:', googleToken);
      return googleToken;
    })
    .then(googleToken => {
      return superagent.get(`https://www.googleapis.com/plus/v1/people/me/openIdConnect`)
        .set('Authorization', `Bearer ${googleToken}`)
        .then(response => {
          let user = response.body;
          console.log('step three:', user);
          return user;
        });
    })
    .then(googleUser => {
      console.log('4 create an account');
      return User.createFromOAuth(googleUser);
    })
    .then(user => {
      console.log('5 created user, generate token...');
      return user.generateToken();
    })
    .catch(err => console.error(err));
};

export default authorize;