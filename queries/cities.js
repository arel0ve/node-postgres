const db = require('./db');

function getAllCities(req, res, next) {
  db.any(`SELECT * 
          FROM cities 
          ORDER BY name`)
      .then(data => {
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ALL cities'
            });
      })
      .catch(err => next(err));
}

function safeRemoveCities(req, res, next) {
  const name = req.params.name;
  db.result(`DELETE FROM cities 
      WHERE name = '${name}' 
        AND NOT EXISTS 
        (SELECT * 
        FROM masters 
        INNER JOIN cities 
          ON (masters.city = cities.id) 
        WHERE name = '${name}' 
        )`)
      .then(result => {
        res.status(200)
            .json({
              status: 'success',
              message: `Removed ${result.rowCount} cities`
            });
      })
      .catch(err => next(err));
}

module.exports = {
  getAllCities: getAllCities,
  safeRemoveCities: safeRemoveCities
};
