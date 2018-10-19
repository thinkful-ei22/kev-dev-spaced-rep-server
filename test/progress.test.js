const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../server');
const User = require('../db/models/userSchema');
const Word = require('../db/models/wordSchema');
const { TEST_DATABASE_URL, JWT_SECRET, JWT_EXPIRY } = require('../config');

const seedWords = require('../db/seed/words');
const seedUsers = require('../db/seed/users');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Japanese API - Progress', function () {

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });
  let token;
  let user;
  beforeEach(function () {
    return Promise.all([
      Word.insertMany(seedWords),
      User.insertMany(seedUsers)
    ])
      .then(userData => {
        // console.log(userData);
        user = userData[1][0];
        console.log('====================================',user, user.username);
        token = jwt.sign({user}, JWT_SECRET, { expiresIn: JWT_EXPIRY});
      });
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /progress/history', function () {
    it('should return the user\'s history', function () {
      return Promise.all([
        User.find({_id: user.id}),
        chai.request(app).get('/api/progress/history')
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(data).to.eql(res);
          expect(res).to.include.all.keys(
            'name', 'username', 'password', 
            'progressHead', 'progress');
        });
    });

  //   it('should return a list with the correct right fields', function () {
  //     return Promise.all([
  //       Food.find().sort({ updatedAt: 'desc' }),
  //       chai.request(app).get('/api/foods')
  //     ])
  //       .then(([data, res]) => {
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.a('array');
  //         expect(res.body).to.have.length(data.length);
  //         res.body.forEach(function (item, i) {
  //           expect(item).to.be.a('object');
  //           // Food: folderId and content are optional
  //           expect(item).to.include.all.keys('name', 'ingredients', 'comments');
  //           expect(item.id).to.equal(data[i].id);
  //           expect(item.title).to.equal(data[i].title);
  //           expect(item.content).to.equal(data[i].content);
  //           expect(new Date(item.createdAt)).to.eql(data[i].createdAt);
  //           expect(new Date(item.updatedAt)).to.eql(data[i].updatedAt);
  //         });
  //       });
  //   });

  //   it('should return correct search results for a searchTerm query', function () {
  //     const searchTerm = 'gaga';
  //     // const re = new RegExp(searchTerm, 'i');
  //     const dbPromise = Food.find({
  //       title: { $regex: searchTerm, $options: 'i' }
  //       // $or: [{ title: re }, { content: re }]
  //     });
  //     const apiPromise = chai.request(app)
  //       .get(`/api/foods?searchTerm=${searchTerm}`);

  //     return Promise.all([dbPromise, apiPromise])
  //       .then(([data, res]) => {
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.a('array');
  //         expect(res.body).to.have.length(1);
  //         res.body.forEach(function (item, i) {
  //           expect(item).to.be.a('object');
  //           expect(item).to.include.all.keys('name', 'ingredients', 'comments'); // Food: folderId and content are optional
  //           expect(item.id).to.equal(data[i].id);
  //           expect(item.title).to.equal(data[i].title);
  //           expect(item.content).to.equal(data[i].content);
  //           expect(new Date(item.createdAt)).to.eql(data[i].createdAt);
  //           expect(new Date(item.updatedAt)).to.eql(data[i].updatedAt);
  //         });
  //       });
  //   });

  //   it('should return an empty array for an incorrect query', function () {
  //     const searchTerm = 'NotValid';
  //     // const re = new RegExp(searchTerm, 'i');
  //     const dbPromise = Food.find({
  //       title: { $regex: searchTerm, $options: 'i' }
  //       // $or: [{ title: re }, { content: re }]
  //     });
  //     const apiPromise = chai.request(app).get(`/api/foods?searchTerm=${searchTerm}`);
  //     return Promise.all([dbPromise, apiPromise])
  //       .then(([data, res]) => {
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.a('array');
  //         expect(res.body).to.have.length(data.length);
  //       });
  //   });

  // });

  // describe('GET /api/foods/:id', function () {

  //   it('should return correct foods', function () {
  //     let data;
  //     return Food.findOne()
  //       .then(_data => {
  //         data = _data;
  //         return chai.request(app).get(`/api/foods/${data.id}`);
  //       })
  //       .then((res) => {
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.an('object');
  //         expect(res.body).to.have.all.keys('name', 'ingredients', 'comments');
  //         expect(res.body.id).to.equal(data.id);
  //         expect(res.body.title).to.equal(data.title);
  //         expect(res.body.content).to.equal(data.content);
  //         expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
  //         expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
  //       });
  //   });

  //   it('should respond with status 400 and an error message when `id` is not valid', function () {
  //     return chai.request(app)
  //       .get('/api/foods/NOT-A-VALID-ID')
  //       .then(res => {
  //         expect(res).to.have.status(400);
  //         expect(res.body.message).to.equal('The `id` is not valid');
  //       });
  //   });

  //   it('should respond with a 404 for an id that does not exist', function () {
  //     // The string "DOESNOTEXIST" is 12 bytes which is a valid Mongo ObjectId
  //     return chai.request(app)
  //       .get('/api/foods/DOESNOTEXIST')
  //       .then(res => {
  //         expect(res).to.have.status(404);
  //       });
  //   });

  // });

  // describe('POST /api/foods', function () {

  //   it('should create and return a new item when provided valid data', function () {
  //     const newItem = {
  //       title: 'The best article about cats ever!',
  //       content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...'
  //     };
  //     let res;
  //     return chai.request(app)
  //       .post('/api/foods')
  //       .send(newItem)
  //       .then(function (_res) {
  //         res = _res;
  //         expect(res).to.have.status(201);
  //         expect(res).to.have.header('location');
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.have.all.keys('name', 'ingredients', 'comments');
  //         return Food.findById(res.body.id);
  //       })
  //       .then(data => {
  //         expect(res.body.id).to.equal(data.id);
  //         expect(res.body.title).to.equal(data.title);
  //         expect(res.body.content).to.equal(data.content);
  //         expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
  //         expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
  //       });
  //   });
  // });

  // describe('PUT /api/foods/:id', function () {

  //   it('should update the note when provided valid data', function () {
  //     const updateItem = {
  //       title: 'What about dogs?!',
  //       content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor...'
  //     };
  //     let data;
  //     return Food.findOne()
  //       .then(_data => {
  //         data = _data;
  //         return chai.request(app)
  //           .put(`/api/foods/${data.id}`)
  //           .send(updateItem);
  //       })
  //       .then(function (res) {
  //         expect(res).to.have.status(200);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.have.all.keys('name', 'ingredients', 'comments');
  //         expect(res.body.id).to.equal(data.id);
  //         expect(res.body.title).to.equal(updateItem.title);
  //         expect(res.body.content).to.equal(updateItem.content);
  //         expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
  //         // expect note to have been updated
  //         expect(new Date(res.body.updatedAt)).to.greaterThan(data.updatedAt);
  //       });
  //   });

  //   it('should respond with status 400 and an error message when `id` is not valid', function () {
  //     const updateItem = {
  //       title: 'What about dogs?!',
  //       content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor...'
  //     };
  //     return chai.request(app)
  //       .put('/api/foods/NOT-A-VALID-ID')
  //       .send(updateItem)
  //       .then(res => {
  //         expect(res).to.have.status(400);
  //         expect(res.body.message).to.equal('The `id` is not valid');
  //       });
  //   });

  //   it('should respond with a 404 for an id that does not exist', function () {
  //     // The string "DOESNOTEXIST" is 12 bytes which is a valid Mongo ObjectId
  //     const updateItem = {
  //       title: 'What about dogs?!',
  //       content: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor...'
  //     };
  //     return chai.request(app)
  //       .put('/api/foods/DOESNOTEXIST')
  //       .send(updateItem)
  //       .then(res => {
  //         expect(res).to.have.status(404);
  //       });
  //   });

  // });

  // describe('DELETE /api/foods/:id', function () {

  //   it('should delete an existing document and respond with 204', function () {
  //     let data;
  //     return Food.findOne()
  //       .then(_data => {
  //         data = _data;
  //         return chai.request(app).delete(`/api/foods/${data.id}`);
  //       })
  //       .then(function (res) {
  //         expect(res).to.have.status(204);
  //         return Food.count({ _id: data.id });
  //       })
  //       .then(count => {
  //         expect(count).to.equal(0);
  //       });
  //   });

  //   it('should respond with a 400 for an invalid id', function () {
  //     return chai.request(app)
  //       .delete('/api/foods/NOT-A-VALID-ID')
  //       .then(res => {
  //         expect(res).to.have.status(400);
  //         expect(res.body.message).to.equal('The `id` is not valid');
  //       });
  //   });
  });
});
