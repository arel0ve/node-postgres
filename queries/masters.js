const db = require('./db');

function getAllMasters(req, res, next) {
  const from = req.query.from ? req.query.from : 0;
  const to = req.query.to ? req.query.to : 10;
  db.any(`SELECT 
        masters.id, 
        masters.firstName, 
        masters.lastName, 
        masters.age, 
        cities.name AS city 
      FROM masters 
      INNER JOIN cities 
        ON (masters.city = cities.id) 
      LIMIT ${(to - from + 1)} 
      OFFSET ${from}`)
      .then(data => {
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ALL masters'
            });
      })
      .catch(err => next(err));
}

function getOneMaster(req, res, next) {
  const id = req.params.id;
  let position = parseInt(req.query.pos);
  position = position ? position : 0;
  db.one(`SELECT 
        masters.firstName, 
        masters.lastName, 
        masters.age, 
        cities.name AS city 
      FROM masters 
      INNER JOIN cities 
        ON (masters.city = cities.id) 
      WHERE masters.id::text = '${id}' 
      OR masters.lastName = '${id}' 
      OR masters.firstName = '${id}' 
      LIMIT 1 OFFSET @ ${position}`)
      .then(data => {
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ONE master'
            });
      })
      .catch(err => next(err));
}

function getMastersByPuppies(req, res, next) {
  const breed = req.query.breed;
  const age = req.query.age;
  const city = req.query.city;

  let query = `SELECT 
        masters.firstName, 
        masters.lastName, 
        masters.age, 
        cities.name AS city 
      FROM masters 
      INNER JOIN cities 
        ON (masters.city = cities.id) 
      INNER JOIN pups 
        ON (pups.master = masters.id) 
      WHERE pups.breed ILIKE '${breed}%'`;

  if (age) {
    query += ` AND pups.age = '${age}'`;
  }

  if (city) {
    query += ` AND cities.name = '${city}'`;
  }

  db.any(query)
      .then(data => {
        res.status(200)
            .json(data);
      })
      .catch(err => {
        console.log(err);
        return next(err);
      });
}

function createMaster(req, res, next) {
  db.result(`INSERT 
        INTO cities (name) 
      VALUES('${req.body['city']}') 
      ON CONFLICT DO NOTHING; 
      WITH city_id AS (
        SELECT id 
        FROM cities 
        WHERE name = '${req.body['city']}'
      ) 
      INSERT 
        INTO masters (firstName, lastName, age, city) 
      SELECT 
        '${req.body['firstName']}', 
        '${req.body['lastName']}', 
        ${parseInt(req.body['age'])}, 
        id 
      FROM city_id`)
      .then(() => {
        res.status(200)
            .json({
              status: 'success',
              message: 'Inserted one master'
            });
      }).catch(err => next(err));

}

function removeMasters(req, res, next) {
  const id = req.params['id'];
  if (!id) return;

  db.result(`DELETE FROM masters 
      WHERE id = ${id} 
      AND NOT EXISTS 
        (SELECT 
            p.id AS id 
          FROM pups p 
          INNER JOIN masters m 
            ON (p.master = m.id) 
          WHERE m.id = ${id} 
        UNION 
          SELECT 
            k.id AS id 
          FROM kittens k 
          INNER JOIN masters m 
            ON (k.master = m.id) 
          WHERE m.id = ${id} 
        )`)
      .then(result => {
        res.status(200)
            .json({
                status: result.rowCount === 0 ? 'unsuccess' : 'success',
                message: `Removed ${result.rowCount} masters`
              });
      }).catch(err => next(err));
}


module.exports = {
  getAllMasters: getAllMasters,
  getOneMaster: getOneMaster,
  getMastersByPuppies: getMastersByPuppies,
  createMaster: createMaster,
  removeMasters: removeMasters
};
