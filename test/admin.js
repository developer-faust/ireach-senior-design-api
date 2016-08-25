'use strict';

var request = require('supertest');
var expect = require("chai").expect;
var mongoose = require('mongoose');
var S = require("string");
var execSync = require('execSync');

var app = require('../middleware/express');
//var app = require('express')();

var group = require('./groups/test.json');
var doctor = require('./doctors/doctor.json');
var doctor2 = require('./doctors/doctor2.json');
var new_doctor2 = require('./doctors/new_doctor2.json');
var new_doctor2_creds = require('./creds/new_doctor_creds.json');
var patient = require('./patients/patient.json');
var new_patient = require('./patients/new_patient.json');
var new_patient_creds = require('./creds/new_patient_creds.json');
var diet1 = require('./diets/diet1.json');

describe('ADMIN TESTS', function(){
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
  it('/doctors - POST - (create doctor)', function(done){
    request(app)
      .post('/doctors')
      .send(doctor2)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('doctor already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(doctor2['email']);
        done();
      });
  });
  it('/groups - POST - create group', function(done){
    request(app)
      .post('/groups')
      .auth(doctor["email"], doctor["pass"])
      .send(group)
      .end(function (err, res){
        expect(res.status).to.equal(201);
        done();
      });
  });
  it('/groups - POST - create group - true negative', function(done){
    request(app)
      .post('/groups')
      .auth(doctor2["email"], doctor2["pass"])
      .send(group)
      .end(function (err, res){
        expect(res.status).to.equal(401);
        done();
      });
  });
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
        expect(diet1.email).to.equal(res.body.email);
        expect(diet1.created).to.equal(res.body.created);
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
  it('/admin/patients - GET - (all patients)', function(done){
    request(app)
      .get('/admin/patients')
      .auth(doctor["email"], doctor["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(res.body.length).to.not.equal(0);
        done();
      });
  });
  it('/admin/patients - GET - (all patients) - true negative', function(done){
    request(app)
      .get('/admin/patients')
      .auth(doctor2["email"], doctor2["pass"])
      .end(function (err, res){
        expect(res.status).to.equal(401);
        done();
      });
  });
  it('/admin/doctors/update_info/:doctor - PUT', function(done){
    request(app)
      .put('/admin/doctors/update_info/'+doctor2.email)
      .auth(doctor['email'], doctor["pass"])
      .send(new_doctor2)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(err).to.be.null;
        done();
      });
  });
  it('/admin/doctors/update_account/:doctor - PUT', function(done){
    request(app)
      .put('/admin/doctors/update_account/'+doctor2.email)
      .auth(doctor['email'], doctor["pass"])
      .send(new_doctor2_creds)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(err).to.be.null;
        done();
      });
  });
  it('/admin/diet/:patient_email - GET', function(done){
    request(app)
      .get('/admin/diet/'+patient.email)
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(err).to.be.null;
        expect(res.body.length).to.not.equal(0);
        done();
      });
  });
  it('/admin/diet/:patient_email/:timestamp - GET', function(done){
    request(app)
      .get('/admin/diet/'+patient.email+'/'+diet1.created)
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(err).to.be.null;
        done();
      });
  });
  it('/admin/patients/update_info/:patient - PUT', function(done){
    request(app)
      .put('/admin/patients/update_info/'+patient.email)
      .auth(doctor['email'], doctor["pass"])
      .send(new_patient)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(err).to.be.null;
        done();
      });
  });
  it('/admin/patients/update_account/:patient - PUT', function(done){
    request(app)
      .put('/admin/patients/update_account/'+patient.email)
      .auth(doctor['email'], doctor["pass"])
      .send(new_patient_creds)
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(err).to.be.null;
        done();
      });
  });

  it('/admin/diet/remove/:patient/:timestamp - DELETE', function (done){
    request(app)
      .del('/admin/diet/remove/'+new_patient_creds['email']+'/'+diet1.created)
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        expect(res.status).to.not.equal(401);
        done();
      });
  });
  it('/admin/patients/remove/:patient - DELETE', function (done){
    request(app)
      .del('/admin/patients/remove/'+new_patient_creds['email'])
      .auth(doctor['email'], doctor["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
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
  it('/groups/remove/:groupid- DELETE - remove group - true negative', function(done){
    request(app)
      .del('/groups/remove/'+group["_id"])
      .auth(doctor2["email"], doctor2["pass"])
      .end(function (err, res){
        expect(res.status).to.equal(401);
        done();
      });
  });
  it('/admin/doctors/remove/:doctor - DELETE', function(done){
    request(app)
      .del('/admin/doctors/remove/'+new_doctor2_creds["email"])
      .auth(doctor["email"], doctor["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/admin/doctors/remove/:doctor - DELETE - true negative', function(done){
    request(app)
      .del('/admin/doctors/remove/'+new_doctor2_creds["email"])
      .auth(doctor2["email"], doctor2["pass"])
      .end(function (err, res){
        expect(res.status).to.equal(401);
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
  it('/doctors/remove - DELETE - true negative', function(done){
    request(app)
      .del('/doctors/remove')
      .auth(doctor2["email"], doctor2["pass"])
      .end(function (err, res){
        expect(res.status).to.equal(401);
        done();
      });
  });
});