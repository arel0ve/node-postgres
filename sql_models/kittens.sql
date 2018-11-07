\c puppies;

CREATE TABLE kittens (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  breed VARCHAR,
  age INTEGER,
  sex VARCHAR,
  master INTEGER
);
