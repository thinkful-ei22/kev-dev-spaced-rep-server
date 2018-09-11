const mongoose = require('mongoose');

const {DATABASE_URL} = require('../config');

const User = require('../db/models/userSchema');
const Word = require('../db/models/wordSchema');

const seedWords = require('../db/seed/words');
const seedUsers = require('../db/seed/users');

mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() =>{
    return Promise.all([
      Word.insertMany(seedWords),
      User.insertMany(seedUsers),
      Word.createIndexes,
      User.createIndexes,
    ]);
  })
  .then(results =>{
    console.info('Init db with Words, Users');
  })
  .then(() => mongoose.disconnect())
  .catch(err =>{
    console.error(err);
  });