const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const createQueryFromRequest = require('../createQueryFromRequest');

const table_name = 'stations';

const VALID_ORDERINGS = [
  'nimi',
  'namn',
  'name',
  'osoite',
  'adress',
  'kaupunki',
  'stad',
  'operaattor',
  'kapasiteet',
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
    res.status(200).send('This is a dummy POST to STATIONS resource');
  } catch (e) {
    next(e);
  }
};

const del = async (req, res, next) => {
  try {
    res.status(200).send('This is a dummy DEL to STATIONS resource');
  } catch (e) {
    next(e);
  }
};

const put = async (req, re, next) => {
  try {
    res.status(200).send('This is a dummy PUT to STATIONS resource');
  } catch (e) {
    next(e);
  }
};

router.route('/stations/:id([1-9]*)?').get(get).post(post).delete(del).put(put);
module.exports = router;
