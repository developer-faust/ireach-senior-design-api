'use strict';

var request = require('supertest');
var expect = require("chai").expect;
var mongoose = require('mongoose');
var S = require("string");
var execSync = require('execSync');

var app = require('../middleware/express');
//var app = require('express')();

describe('DOCTOR TESTS', function(){
  var doctor = require('./doctors/doctor.json');
  var fakedoctor = JSON.parse(JSON.stringify(doctor));
  delete fakedoctor.hospital;
  fakedoctor.email = fakedoctor.email+'n';
  var new_doctor = require('./doctors/new_doctor.json');
  var new_doctor_creds = require('./creds/new_doctor_creds.json');

  //curl --request POST localhost:5025/doctors --data "email=example@test.com" --data "first_name=example" --data "last_name=test" --data "specialty=specs" --data "hospital=hosp" --data "pass=pass" 
  it('/doctors - POST - (create doctor)', function(done){
    request(app)
      .post('/doctors')
      .send(doctor)
      .end(function (err, res){
        if (res.body['error']) {
          console.log(res.body['error']);
          expect(S(res.body['error']).startsWith('doctor already exists')).to.be.true;
        }
        else
          expect(res.body['email']).to.equal(doctor['email']);
        done();
      });
  });
  it('/doctors - POST - (create doctor) - true negative', function(done){
    request(app)
      .post('/doctors')
      .send(fakedoctor)
      .end(function (err, res){
        expect(res.status).to.not.equal(201);
        done();
      });
  });
  it('/doctors - GET - (all doctors)', function(done){
    request(app)
      .get('/doctors')
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(res.body.indexOf(doctor['email'])).to.not.equal(-1);
        done();
      });
  });
  it('/doctors/:email - GET - (specific doctor)', function(done){
    request(app)
      .get('/doctors/'+doctor["email"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  //curl --request POST localhost:5025/doctors/update_info --data "email=example@test.com" --data "first_name=new_example" --data "last_name=new_test" --data "specialty=new_specs" --data "hospital=new_hosp" --data "pass=new_pass"     
  it('/doctors/update_info - PUT', function(done){
    request(app)
      .put('/doctors/update_info')
      .auth(doctor['email'], doctor["pass"])
      .send(new_doctor)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(err).to.be.null;
        done();
      });
  });
  it('/doctors/update_info - PUT - true negative', function(done){
    request(app)
      .put('/doctors/update_info')
      .auth(fakedoctor['email'], fakedoctor["pass"])
      .send(new_doctor)
      .end(function (err, res){
        expect(res.status).to.equal(401);
        expect(err).to.not.be.null;
        done();
      });
  });
  it('/doctors/:email - GET - (specific doctor)', function(done){
    request(app)
      .get('/doctors/'+new_doctor["email"])
      .end(function (err, res){
        expect(res.body['specialty']).to.equal('new_specs');
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/doctors/update_account - PUT', function(done){
    request(app)
      .put('/doctors/update_account')
      .auth(doctor['email'], doctor["pass"])
      .send(new_doctor_creds)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(err).to.be.null;
        done();
      });
  });
  it('/doctors/update_account - PUT - true negative', function(done){
    request(app)
      .put('/doctors/update_account')
      .auth(fakedoctor['email'], fakedoctor["pass"])
      .send(new_doctor_creds)
      .end(function (err, res){
        expect(res.status).to.equal(401);
        expect(err).to.not.be.null;
        done();
      });
  });
  it('/doctors/:email - GET - (specific doctor)', function(done){
    request(app)
      .get('/doctors/'+new_doctor_creds["email"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/doctors/remove - DELETE', function(done){
    request(app)
      .del('/doctors/remove')
      .auth(new_doctor_creds["email"], new_doctor_creds["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
});