'use strict';

var request = require('supertest');
var expect = require("chai").expect;
var mongoose = require('mongoose');
var S = require("string");
var execSync = require('execSync');

var app = require('../middleware/express');
//var app = require('express')();

var doctor = require('./doctors/doctor.json');
var patient = require('./patients/patient.json');
var new_patient_creds = require('./creds/new_patient_creds.json');
var group = require('./groups/test.json');
var diet1 = require('./diets/diet1.json');
var diet2 = require('./diets/diet2.json');
var update_diet2 = require('./diets/new_diet2.json');

describe('DIET TEST', function(){
  this.timeout(15000);
  // creating prerequisites for tests (doctor, patient, group)
  //curl --request POST localhost:5025/doctors --data "email=doctor@test.com" --data "first_name=doctor" --data "last_name=test" --data "specialty=specs" --data "hospital=hosp" --data "pass=pass" 
  it('/doctors - POST - (create doctor)', function (done){
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
  it('/groups - POST - (create group)', function (done){
    request(app)
      .post('/groups')
      .auth(doctor['email'], doctor["pass"])
      .send(group)
      .end(function (err, res){
        done();
      });
  });
  //curl --request POST localhost:5025/patients --data "email=patient@test.com" --data "first_name=patient" --data "last_name=test" --data "group=example" --data "doctor=doctor@test.com" --data "pass=pass" --data "age=21" --data "height=72" --data "weight=195" --data "sex=male" 
  it('/patients - POST - (create patient)', function (done){
    request(app)
      .post('/patients')
      .send(patient)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(patient['email']);
        done();
      });
  });


  it('/diet - POST - (food entry)', function (done) {
    request(app)
      .post('/diet')
      .auth(patient['email'], patient["pass"])
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
      .auth(patient['email'], patient["pass"])
      .send(diet2)
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet2.foodID).to.equal(res.body.foodID);
        expect(diet2.email).to.equal(res.body.email);
        expect(diet2.created).to.equal(res.body.created);
        done();
      });
  });
  it('/diet - GET - (food entry)', function (done) {
    request(app)
      .get('/diet')
      .auth(patient['email'], patient["pass"])
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(res.body.length).to.equal(2);
        done();
      });
  });
  it('/diet/:timestamp - GET - (food entry)', function (done) {
    request(app)
      .get('/diet/'+diet2.created)
      .auth(patient['email'], patient["pass"])
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet2.email).to.equal(res.body.email);
        expect(diet2.created).to.equal(res.body.created);
        expect(diet2.foodID).to.equal(res.body.foodID);
        done();
      });
  });
  it('/diet/:patient_email - GET - (food entry)', function (done) {
    request(app)
      .get('/diet/doctor/'+patient.email)
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(res.body.length).to.equal(2);
        done();
      });
  });
  it('/diet/:patient_email/:timestamp - GET - (food entry)', function (done) {
    request(app)
      .get('/diet/doctor/'+patient.email+'/'+diet2.created)
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet2.email).to.equal(res.body.email);
        expect(diet2.foodID).to.equal(res.body.foodID);
        expect(diet2.created).to.equal(res.body.created);
        done();
      });
  });
  it('/diet - PUT - (food entry)', function (done) {
    request(app)
      .put('/diet/'+diet2.created)
      .auth(patient['email'], patient["pass"])
      .send(update_diet2)
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(diet2.foodID).to.equal(res.body.foodID);
        expect(diet2.created).to.equal(res.body.created);
        done();
      });
  });
  it('/diet/:patient_email/:timestamp - GET - (food entry)', function (done) {
    request(app)
      .get('/diet/doctor/'+patient.email+'/'+update_diet2.created)
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res) {
        expect(res.status).to.not.equal(401);
        expect(update_diet2.foodID).to.equal(res.body.foodID);
        expect(update_diet2.created).to.equal(res.body.created);
        done();
      });
  });

  it('/patients/update_account - PUT', function (done){
    request(app)
      .put('/patients/update_account')
      .auth(patient['email'], patient["pass"])
      .send(new_patient_creds)
      .end(function (err, res){
        expect(err).to.be.null;
        done();
      });
  });

  it('/diet/:timestamp - DELETE', function (done){
    request(app)
      .del('/diet/'+diet1.created)
      .auth(new_patient_creds['email'], new_patient_creds["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        expect(res.status).to.not.equal(401);
        done();
      });
  });
  it('/diet/:timestamp - DELETE', function (done){
    request(app)
      .del('/diet/'+update_diet2.created)
      .auth(new_patient_creds['email'], new_patient_creds["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        expect(res.status).to.not.equal(401);
        done();
      });
  });


  // deleting prerequisites for tests (doctor, patient, group)
  //curl --request POST localhost:5025/patients/remove --data "email=patient@test.com" --data "first_name=new_patient" --data "last_name=new_test" --data "group=new_example" --data "doctor=doctor@test.com" --data "pass=new_pass" --data "age=99" --data "height=99" --data "weight=99" --data "sex=male" 
  it('/patients/remove - DELETE', function (done){
    request(app)
      .del('/patients/remove')
      .auth(new_patient_creds['email'], new_patient_creds["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  //removes group
  it('/groups/remove/:groupid - DELETE', function(done){
    request(app)
      .del('/groups/remove/'+group["_id"])
      .auth(doctor["email"], doctor["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  //remove patients doctor
  it('/doctors/remove - DELETE', function (done){
    request(app)
      .del('/doctors/remove')
      .auth(doctor["email"], doctor["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
});