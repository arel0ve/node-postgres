const db = require('./db');

function getAllPuppies(req, res, next) {
  const from = req.query.from ? req.query.from : 0;
  const to = req.query.to ? req.query.to : 10;
  db.any(`SELECT
          ('puppy') as type,
          p.id,
          p.name AS name,
          p.breed AS breed,
          p.age AS age,
          p.sex AS sex,
          c.name AS city
        FROM pups p
        INNER JOIN masters m
          ON (p.master = m.id)
        INNER JOIN cities c
          ON (m.city = c.id)
      UNION
        SELECT
          ('kitten') as type,
          k.id,
          k.name AS name,
          k.breed AS breed,
          k.age AS age,
          k.sex AS sex,
          c.name AS city
        FROM kittens k
        INNER JOIN masters m
          ON (k.master = m.id)
        INNER JOIN cities c
          ON (m.city = c.id)
      ORDER BY type, breed, age, sex, city, name
      LIMIT ${to - from + 1} OFFSET ${from}`)
      .then(data => {
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ALL puppies'
            });
      })
      .catch(err => {
        console.log(err);
        return next(err);
      });
}

function getSinglePuppy(req, res, next) {
  const pupID = parseInt(req.params.id);
  db.one(`SELECT 
          ('puppy') as type, 
          p.name, 
          p.breed, 
          p.age, 
          p.sex, 
          c.name AS city 
        FROM pups p 
        INNER JOIN masters m 
          ON (p.master = m.id) 
        INNER JOIN cities c 
          ON (m.city = c.id) 
        WHERE p.id = '${pupID}' 
      UNION 
        SELECT 
          ('kitten') as type, 
          k.name, 
          k.breed, 
          k.age, 
          k.sex, 
          c.name AS city 
        FROM kittens k 
        INNER JOIN masters m 
          ON (k.master = m.id) 
        INNER JOIN cities c 
          ON (m.city = c.id) 
        WHERE k.id = '${pupID}' `)
      .then(data => {
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ONE puppy'
            });
      })
      .catch(err => next(err));
}

function createPuppy(req, res, next) {
  db.result(`WITH master_id AS (
        SELECT id 
        FROM masters 
        WHERE firstName = '${req.body['firstName']}' 
          AND lastName = '${req.body['lastName']}'
        LIMIT 1 OFFSET 0
      )
        INSERT 
          INTO pups (name, breed, age, sex, master) 
          SELECT 
            '${req.body['name']}', 
            '${req.body['breed']}', 
            ${parseInt(req.body['age'])}, 
            '${req.body['sex']}', 
            id
          FROM master_id `)
      .then(result => {
        res.status(200)
            .json({
              status: 'success',
              message: `Inserted ${result.rowCount} puppy`
            });
      })
      .catch(err => next(err));
}

function updatePuppy(req, res, next) {
  db.none(`UPDATE pups 
           SET name='${req.body['name']}', breed='${req.body['breed']}', 
           age=${parseInt(req.body['age'])}, sex='${req.body['sex']}' 
         WHERE id=${parseInt(req.params.id)}`)
      .then(() => {
        res.status(200)
            .json({
              status: 'success',
              message: 'Updated puppy'
            });
      })
      .catch(err => next(err));
}

function removePuppy(req, res, next) {
  const pupID = parseInt(req.params.id);
  db.any(`WITH p_type AS (
          DELETE FROM pups 
            WHERE id=${pupID}
            RETURNING 'puppies' AS type
        ), k_type AS (
          DELETE FROM kittens 
            WHERE id=${pupID}
            RETURNING 'kittens' AS type
        )
          SELECT 
            count(type),
            type
          FROM p_type
          GROUP BY type
        UNION 
          SELECT 
            count(type),
            type
          FROM k_type
          GROUP BY type
        `)
      .then(removed => {
        res.status(200)
            .json({
              status: 'success',
              data: removed,
              message: `Removed ${removed[0].count} ${removed[0].type}`
            });
      })
      .catch(err => {
        console.log(err);
        return next(err);
      });
}

function moveToKittens(req, res, next) {
  const pupID = parseInt(req.params.id);
  db.result(`WITH moved_rows AS ( 
        DELETE FROM pups 
        WHERE pups.id = ${pupID} 
        RETURNING * 
      ) 
      INSERT INTO kittens 
        SELECT * FROM moved_rows`)
      .then(result => {
        res.status(200)
            .json({
              status: 'success',
              message: `Moved ${result.rowCount} puppies to kittens`
            });
      })
      .catch(err => next(err));
}

function getKittens(req, res, next) {
  db.any('SELECT * FROM kittens')
      .then(data => {
        res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved ALL kittens'
            });
      })
      .catch(err => next(err));
}


module.exports = {
  getAllPuppies: getAllPuppies,
  getSinglePuppy: getSinglePuppy,
  createPuppy: createPuppy,
  updatePuppy: updatePuppy,
  removePuppy: removePuppy,
  moveToKittens: moveToKittens,
  getKittens: getKittens
};
