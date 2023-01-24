const express = require('express');
const sqlite3 = require('sqlite3');
const stations = require('./routes/stations.js');
const trips = require('./routes/trips.js');

const port = 8080;

const app = express();
const db = new sqlite3.Database('../bikingdata.db');

app.use(express.json());
app.get('/', (req, res, next) => {
  res.send('This is a test');
  next();
});

app.use('/', trips);
app.use('/', stations);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
