const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('../bikingdata.db');

const validateSortBy = (oSortBy, VALID_ORDERINGS) => {
  const VALID_ORDERING_DIRECTIONS = ['asc', 'desc'];
  const DEFAULT_SORT_DIRECTION = VALID_ORDERING_DIRECTIONS[0];

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

const createQueryFromRequest = (tableName, req) => {
  const queryCreator = {
    db: db,
    query: `SELECT * FROM ${tableName} WHERE 1 = 1`,
    placeholders: [],
    filter: () => {
      console.log('filterable()');
      const temp = queryCreator;

      const field = req.query.field;
      const value = req.query.value;

      if (field && value) {
        temp.query += ` AND ${field} = ?`;
        temp.placeholders.push(value);
      }

      return temp;
    },
    order: (validOrderableColumns) => {
      console.log('orderable()');
      const temp = queryCreator;
      const sortBy = req.query.sort_by || 'Departure:Asc';
      let [ordering, direction] = validateSortBy(sortBy, validOrderableColumns);
      temp.query += ` ORDER BY ${ordering} ${direction}`;
      return temp;
    },
    paginate: () => {
      console.log('paginatable()');
      const temp = queryCreator;
      const page = req.query.page || 1;
      const perPage = req.query.per_page || 10;
      const offset = (page - 1) * perPage;
      temp.query += ' LIMIT ? OFFSET ?';
      temp.placeholders.push(perPage, offset);
      return temp;
    },
    find: () => {
      return new Promise((resolve, reject) => {
        queryCreator.db.all(
          queryCreator.query,
          queryCreator.placeholders,
          (err, rows) => {
            if (err) {
              reject(new Error(err));
            } else {
              resolve(rows);
            }
          }
        );
      });
    },
  };

  return queryCreator;
};

module.exports = createQueryFromRequest;
