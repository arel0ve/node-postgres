const db = require('../queries/db');

function createPupsIndex() {
  createIndex('pups_breed_age_sex', 'pups(breed, age, sex)');
}

function deletePupsIndex() {
  deleteIndex('pups_breed_age_sex');
}

function createCityIndex() {
  createIndex('cities_name', 'cities(name)', true);
}

function deleteCityIndex() {
  deleteIndex('cities_name');
}

function createIndex(name, on, isUnique) {
  if (!name) return;
  let unique = isUnique ? 'UNIQUE' : '';
  db.none(`CREATE ${unique} INDEX name ON ${on}`)
      .then(() => {
        console.info(`index '${name.toUpperCase()}' has been created`);
      })
      .catch(err => {
        if (err.message.includes('already exists')) {
          console.error(`index '${name.toUpperCase()}' has already exists`);
        } else {
          console.error(err);
        }
      });
}

function deleteIndex(name) {
  db.none(`DROP INDEX ${name}`)
      .then(() => {
        console.info(`index '${name.toUpperCase()}' has been removed`);
      })
      .catch(err => {
        if (err.message.includes('does not exist')) {
          console.error(`index '${name.toUpperCase()}' does not exist`);
        } else {
          console.error(err);
        }
      });
}

module.exports = {
  createPupsIndex,
  deletePupsIndex,
  createCityIndex,
  deleteCityIndex
};
