'use strict';

import express from 'express';
const uploadRouter = express.Router();

import multer from 'multer';
const upload = multer({dest: `${__dirname}/../../tmp/`});

import auth from '../auth/lib/middleware.js';
import s3 from '../lib/s3';

uploadRouter.post('/upload', auth, upload.any(), (req, res, next) => {
  console.log('made it to postland');
  if (!req.files.length) next('error uploading file');

  let file = req.files[0];
  let key = `${file.filename}.${file.originalname}`;

  s3.upload(file.path, key)
    .then(url => {
      res.status(200);
      res.send({url: url});
    })
    .catch(next);
  
});

export default uploadRouter;