'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var expect = require("chai").expect;
var S = require("string");
var execSync = require('execSync');

var app = require('../middleware/express');

// import doctors
var house = require('./doctors/house.json');
var lipschitz = require('./doctors/lipschitz.json');

// import patients
var jeremy = require('./patients/jeremy.json');
var jm = require('./patients/jm.json');
var barrack = require('./patients/barrack.json');
var oprah = require('./patients/oprah.json');
var marisa = require('./patients/marisa.json');
var michelle = require('./patients/michelle.json');
var samuel = require('./patients/samuel.json');

// import groups
var type_i_diabetes = require('./groups/type_i_diabetes');
var type_ii_diabetes = require('./groups/type_ii_diabetes');
var cancer = require('./groups/cancer');

//import diet
var diet1 = require('./diets/jm_1.json');
var diet2 = require('./diets/jm_2.json');
var diet3 = require('./diets/jm_3.json');

var raw_data1 = require('./raw_data/raw_data1');
var raw_data2 = require('./raw_data/raw_data2');

var data1 = require('./data/data1.json');
var data2 = require('./data/data2.json');
//var data3 = require('./data/data3.json'); true negatives - won't pass test
//var data4 = require('./data/data4.json'); true negatives - won't pass test
//var data5 = require('./data/data5.json'); true negatives - won't pass test
var data6 = require('./data/data6.json');
var data7 = require('./data/data7.json');


before(function (done) {
  mongoose.connect('mongodb://localhost/m3', function (err) {
    if (err) console.log(err);
    done();
  });
});

after(function (done) {
  mongoose.connection.close();
  done();
});

describe('WEBSITE TESTING - ENTER ', function(){
  // create doctors
  it('/doctors - POST - (create doctor)', function (done){
    request(app)
      .post('/doctors')
      .send(lipschitz)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('doctor already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(lipschitz['email']);
        execSync.exec('./test/make_admin.sh '+lipschitz.email);
        done();
      });
  });
  it('/doctors - POST - (create doctor)', function (done){
    request(app)
      .post('/doctors')
      .send(house)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('doctor already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(house['email']);
        done();
      });
  });

  // create groups
  it('/groups - POST - (create group)', function (done){
    request(app)
      .post('/groups')
      .auth(lipschitz["email"], lipschitz["pass"])
      .send(type_i_diabetes)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        done();
      });
  });
  it('/groups - POST - (create group)', function (done){
    request(app)
      .post('/groups')
      .auth(lipschitz["email"], lipschitz["pass"])
      .send(type_ii_diabetes)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        done();
      });
  });
  it('/groups - POST - (create group)', function (done){
    request(app)
      .post('/groups')
      .auth(lipschitz["email"], lipschitz["pass"])
      .send(cancer)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        done();
      });
  });

  // create patients
  it('/patients - POST - (create jeremy)', function (done){
    request(app)
      .post('/patients')
      .send(jeremy)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(jeremy['email']);
        done();
      });
  });
  it('/patients - POST - (create jm)', function (done){
    request(app)
      .post('/patients')
      .send(jm)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(jm['email']);
        done();
      });
  });
  it('/patients - POST - (create barrack)', function (done){
    request(app)
      .post('/patients')
      .send(barrack)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(barrack['email']);
        done();
      });
  });
  it('/patients - POST - (create oprah)', function (done){
    request(app)
      .post('/patients')
      .send(oprah)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(oprah['email']);
        done();
      });
  });
  it('/patients - POST - (create marisa)', function (done){
    request(app)
      .post('/patients')
      .send(marisa)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(marisa['email']);
        done();
      });
  });
  it('/patients - POST - (create michelle)', function (done){
    request(app)
      .post('/patients')
      .send(michelle)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(michelle['email']);
        done();
      });
  });
  it('/patients - POST - (create samuel)', function (done){
    request(app)
      .post('/patients')
      .send(samuel)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(samuel['email']);
        done();
      });
  });

  //diet entry
  it('/diet - POST - (food entry)', function (done) {
    request(app)
      .post('/diet')
      .auth(jm['email'], jm["pass"])
      .send(diet1)
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet1.foodID).to.equal(res.body.foodID);
        expect(diet1.email).to.equal(res.body.email);
        expect(diet1.created).to.equal(res.body.created);
        done();
      });
  });
  it('/diet - POST - (food entry)', function (done) {
    request(app)
      .post('/diet')
      .auth(jm['email'], jm["pass"])
      .send(diet2)
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet2.foodID).to.equal(res.body.foodID);
        expect(diet2.email).to.equal(res.body.email);
        expect(diet2.created).to.equal(res.body.created);
        done();
      });
  });
  it('/diet - POST - (food entry)', function (done) {
    request(app)
      .post('/diet')
      .auth(jm['email'], jm["pass"])
      .send(diet3)
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet3.foodID).to.equal(res.body.foodID);
        expect(diet3.email).to.equal(res.body.email);
        expect(diet3.created).to.equal(res.body.created);
        done();
      });
  });
  it('/raw_data - POST - (create raw_data1)', function (done){
    request(app)
      .post('/raw_data')
      .auth(jm['email'], jm["pass"])
      .send(raw_data1)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('data already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(jm['email']);
        done();
      });
  });
  it('/raw_data - POST - (create raw_data2)', function (done){
    request(app)
      .post('/raw_data')
      .auth(jm['email'], jm["pass"])
      .send(raw_data2)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('data already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(jm['email']);
        done();
      });
  });
  /*it('/data - POST - (create data1)', function (done){
    request(app)
      .post('/data')
      .auth(jm['email'], jm["pass"])
      .send(data1)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(data1['email']);
        done();
      });
  });
  it('/data - POST - (create data2)', function (done){
    request(app)
      .post('/data')
      .auth(jm['email'], jm["pass"])
      .send(data2)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(data2['email']);
        done();
      });
  });

  it('/data - POST - (create data6)', function (done){
    request(app)
      .post('/data')
      .auth(jm['email'], jm["pass"])
      .send(data6)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(data6['email']);
        done();
      });

  });
  it('/data - POST - (create data7)', function (done){
    request(app)
      .post('/data')
      .auth(jm['email'], jm["pass"])
      .send(data7)
      .end(function (err, res){
        if (res.body['error']) {
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        }
        else
          expect(res.body['email']).to.equal(data7['email']);
        done();
      });

  });  */
});
