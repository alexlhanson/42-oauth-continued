'use strict';

import superagent from 'superagent';
import User from '../model.js';

const authorize = (req) => {
  let code = req.query.code;
  console.log('step 1: code', code);

  return superagent.post('https://github.com/login/oauth/access_token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
    })
    .then(res => {
      let githubToken = res.body.access_token;
      console.log('step 2:', githubToken);
      return githubToken;
    })
    .then(githubToken => {
      return superagent.get(`https://api.github.com/user`)
        .set('Authorization', `Bearer ${githubToken}`)
        .then(response => {
          let user = response.body;
          console.log('step three:', user);
          return user;
        });
    })
    .then(githubUser => {
      console.log('4 create an account');
      return User.createFromOAuth(githubUser);
    })
    .then(user => {
      console.log('5 created user, generate token...');
      return user.generateToken();
    })
    .catch(err => console.error(err));
};

export default authorize;