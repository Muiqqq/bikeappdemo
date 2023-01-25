const express = require('express');
const router = express.Router();
const db = require('../database');

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

const VALID_ORDERING_DIRECTIONS = ['asc', 'desc'];

const DEFAULT_SORT_DIRECTION = VALID_ORDERING_DIRECTIONS[0];

const validateSortBy = (oSortBy) => {
  let sortBy = oSortBy;

  if (!sortBy.includes(':')) {
    sortBy = sortBy.concat(`:${DEFAULT_SORT_DIRECTION}`);
  }

  let [ordering, direction] = sortBy.toLowerCase().split(':');
  if (
    !VALID_ORDERINGS.includes(ordering) &&
    !VALID_ORDERING_DIRECTIONS.includes(direction)
  ) {
    console.log(ordering);
    console.log(direction);
    throw new Error('Not a valid way to sort.');
  } else {
    return [ordering, direction];
  }
};

const get = async (req, res, next) => {
  try {
    const sortBy = req.query.sort_by || 'Departure:Asc';
    const page = req.query.page || 1;
    const perPage = req.query.per_page || 10;
    const offset = (page - 1) * perPage;

    const field = req.query.field;
    const value = req.query.value;

    let query = `SELECT * FROM ${table_name} WHERE 1 = 1`;
    let placeholders = [];
    if (field && value) {
      query += ` AND ${field} = ?`;
      placeholders.push(value);
    }

    let [ordering, direction] = validateSortBy(sortBy);
    query += ` ORDER BY ${ordering} ${direction}`;
    query += ' LIMIT ? OFFSET ?';
    placeholders.push(perPage, offset);

    db.all(query, placeholders, (err, rows) => {
      if (err) {
        throw err;
      } else {
        res.send(rows);
      }
    });
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
