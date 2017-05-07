const db_connection = require('./../../database/db_connection.js');

const dataFromDatabase = {};

dataFromDatabase.getHomeOwnersBasic = (cb) => {
  db_connection.query(' SELECT first_name AS name, longitude AS longitude, latitude FROM homeownerprofile', (err, res) => {
    if (err) return cb(err);
    return cb(null, res.rows);
  });
};

dataFromDatabase.getHomeOwners = (cb) => {
  db_connection.query(' SELECT * FROM homeownerprofile', (err, res) => {
    if (err) return cb(err);
    return cb(null, res.rows);
  });
};

module.exports = dataFromDatabase;
