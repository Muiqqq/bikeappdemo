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

const getOperatorFromValue = (value) => {
  // Assuming value is one of: ['value;lte', 'value;lt', 'value;gt', 'value;gte', 'value']
  if (value.includes(';')) {
    const [val, op] = value.split(';');
    switch (op) {
      case 'lt':
        return [val, '<'];
      case 'lte':
        return [val, '<='];
      case 'gt':
        return [val, '>'];
      case 'gte':
        return [val, '>='];
      default:
        throw new Error('ERROR: Bad parameter');
    }
  } else {
    return [value, '='];
  }
};

const createQueryFromRequest = (tableName, req) => {
  const queryCreator = {
    db: db,
    query: `SELECT * FROM ${tableName} WHERE 1 = 1`,
    placeholders: [],
    filter: (validFilterableColumns) => {
      const temp = queryCreator;
      const filterBy = {};
      for (const element of validFilterableColumns) {
        if (element in req.query) {
          filterBy[element] = req.query[element];
        }
      }
      for (const property in filterBy) {
        const [value, operator] = getOperatorFromValue(filterBy[property]);
        const fieldName = property;
        temp.query += ` AND "${fieldName}" ${operator} ?`;
        temp.placeholders.push(value);
      }
      return temp;
    },
    order: (validOrderableColumns) => {
      const temp = queryCreator;
      const sortBy = req.query.sort_by || 'Departure:Asc';
      let [ordering, direction] = validateSortBy(sortBy, validOrderableColumns);
      temp.query += ` ORDER BY ${ordering} ${direction}`;
      return temp;
    },
    paginate: () => {
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
