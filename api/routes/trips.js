const express = require('express');
const router = express.Router();

const get = async (req, res, next) => {
  try {
    res.status(200).send('This is a dummy GET to TRIPS resource');
  } catch (e) {
    next(e);
  }
};

const post = async (req, res, next) => {
  try {
    res.status(200).send('This is a dummy POST to TRIPS resource');
  } catch (e) {
    next(e);
  }
};

const del = async (req, res, next) => {
  try {
    res.status(200).send('This is a dummy DEL to TRIPS resource');
  } catch (e) {
    next(e);
  }
};

const put = async (req, re, next) => {
  try {
    res.status(200).send('This is a dummy PUT to TRIPS resource');
  } catch (e) {
    next(e);
  }
};

router.route('/trips/:id([1-9]*)?').get(get).post(post).delete(del).put(put);
module.exports = router;
