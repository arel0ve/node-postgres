const db = require('../queries/db');

function createPupsIndex() {
  db.none('CREATE INDEX pups_breed_age_sex ON pups(breed, age, sex)')
      .then(() => {
        console.info('index on PUPS has been created');
      })
      .catch(err => {
        if (err.message.includes('already exists')) {
          console.error('index on PUPS has already exists');
        } else {
          console.error(err);
        }
      });
}

function deletePupsIndex() {
  db.none('DROP INDEX pups_breed_age_sex')
      .then(() => {
        console.info('index on PUPS has been removed');
      })
      .catch(err => {
        if (err.message.includes('does not exist')) {
          console.error('index on PUPS does not exist');
        } else {
          console.error(err);
        }
      });
}

function

module.exports = {
  createPupsIndex,
  deletePupsIndex
};
