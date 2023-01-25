const express = require('express');
const router = express.Router();
const createQueryFromRequest = require('../createQueryFromRequest');

const table_name = 'trips';

const VALID_ORDERINGS = [
  'departure',
  'return',
  'departure_station_id',
  'departure_station_name',
  'return_station_id',
  'return_station_name',
  'covered_distance_(m)',
  'duration_(sec.)',
];

const VALID_FILTERABLES = VALID_ORDERINGS;

const get = async (req, res, next) => {
  try {
    const result = await createQueryFromRequest(table_name, req)
      .filter(VALID_FILTERABLES)
      .order(VALID_ORDERINGS)
      .paginate()
      .find();
    res.status(200).send(result);
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
