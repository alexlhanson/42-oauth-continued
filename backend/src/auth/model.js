'use strict';

import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import mongoose from 'mongoose';
import { promisify } from 'util';

let Schema = mongoose.Schema;


const userSchema = Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
});

userSchema.pre('save', function (next) {

  bcrypt.hash(this.password, 2)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => {
      console.error(error);
    });
});

userSchema.statics.authenticate = function (auth) {
  let mongoQuery = { username: auth.username };

  // look for the user in mongo, if it exists check the password provided in the auth against the password in the database
  return this.findOne(mongoQuery)
    .then(user => user && user.comparePassword(auth.password))
    .catch(console.error);
};

userSchema.statics.authorize = function (token) {
  console.log(token);
  let parsedToken = jwt.verify(token, process.env.SECRET);
  let query = { _id: parsedToken.id };
  console.log(query);

  return this.findOne(query)
    .then(user => user)
    .catch(console.error);

};

userSchema.statics.createFromOAuth = function (googleUser) {
  console.log('creating user from google user');
  if (!googleUser) {
    return Promise.reject('invalid google user');
  }
  return this.findOne({ username: googleUser.login })
  .then(user => {
    if (!user) { throw new Error('User not found'); }
    console.log('welcome back');
    return user;
  })
  .catch(err => {
    let username = googleUser.email;
    let password = 'none';
    
    console.log(googleUser);
      return this.create({
        username: username,
        password: password,
      });
    });
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

userSchema.fromToken = function(token){
  return promisify(jwt.verify)(token, process.env.SECRET)
    .then(({tokenSeed}) => User.findOne({tokenSeed}))
    .then(user => {
      if(!user) throw new error(401, 'AUTH error: user not found');
      return user;
    })
}

export default mongoose.model('users', userSchema);