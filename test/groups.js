'use strict';

var request = require('supertest');
var expect = require("chai").expect;
var mongoose = require('mongoose');
var S = require("string");
var execSync = require('execSync');

var app = require('../middleware/express');
//var app = require('express')();

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

var group = require('./groups/test.json');
var doctor = require('./doctors/doctor.json');

describe('GROUP TESTS', function(){
  //curl --request POST localhost:5025/doctors --data "email=example@test.com" --data "first_name=example" --data "last_name=test" --data "specialty=specs" --data "hospital=hosp" --data "pass=pass" 
  it('/doctors - POST - (create doctor)', function(done){
    request(app)
      .post('/doctors')
      .send(doctor)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('doctor already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(doctor['email']);
        execSync.exec('./test/make_admin.sh '+doctor.email);
        done();
      });
  });
  //curl https://localhost:5025 --request POST --data "_id=example"
  it('/groups - POST - create group', function(done){
    request(app)
      .post('/groups')
      .auth(doctor["email"], doctor["pass"])
      .send(group)
      .end(function (err, res){
        execSync.exec('./test/check_admin.sh '+doctor.email);
        done();
      });
  });
  it('/groups - GET - get all groups', function(done){
    request(app)
      .get('/groups')
      .end(function (err, res){
        expect(res.body.filter(function(v){ return v['_id']===group._id;}).length).to.not.equal(0);
        done();
      });
  });
  it('/groups/remove/:groupid- DELETE - remove group', function(done){
    request(app)
      .del('/groups/remove/'+group["_id"])
      .auth(doctor["email"], doctor["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/doctors/remove - DELETE', function(done){
    request(app)
      .del('/doctors/remove')
      .auth(doctor["email"], doctor["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
});