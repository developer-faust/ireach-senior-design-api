'use strict';

var request = require('supertest');
var expect = require("chai").expect;
var S = require("string");
var execSync = require('execSync');

var app = require('../middleware/express');
//var app = require('express')();

var house = require('./doctors/house.json');
var jm = require('./patients/jm.json');
var group = require('./groups/test.json');
var raw_data1 = require('./raw_data/raw_data1.json');
var raw_data2 = require('./raw_data/raw_data2.json');
var raw_data3 = require('./raw_data/raw_data3.json');
var raw_data4 = require('./raw_data/raw_data4.json');

describe('RAW DATA TEST', function(){
  it('/doctors - POST - (create doctor)', function (done){
    request(app)
      .post('/doctors')
      .send(house)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('house already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(house['email']);
        execSync.exec('./test/make_admin.sh '+house.email);
        done();
      });
  });
  it('/groups - POST - (create group)', function (done){
    request(app)
      .post('/groups')
      .auth(house['email'], house["pass"])
      .send(group)
      .end(function (err, res){
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

  it('/raw_data - POST - (create raw_data1)', function (done){
    request(app)
      .post('/raw_data')
      .auth(jm['email'], jm["pass"])
      .send(raw_data1)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(raw_data1['email']);
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
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(raw_data2['email']);
        done();
      });
  });
  it('/raw_data - POST - (create raw_data3) - true negative - repeating timestamp', function (done){
    request(app)
      .post('/raw_data')
      .auth(jm['email'], jm["pass"])
      .send(raw_data3)
      .end(function (err, res){
        expect(err).to.not.equal(undefined);
        expect(err).to.not.equal(null);
        done();
      });
  });
  it('/raw_data - POST - (create raw_data4)', function (done){
    request(app)
      .post('/raw_data')
      .auth(jm['email'], jm["pass"])
      .send(raw_data4)
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('patient already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(raw_data4['email']);
        done();
      });
  });
  it('/raw_data/:timestamp - DELETE raw_data1', function (done){
    request(app)
      .del('/raw_data/'+raw_data1.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){

        expect(res.body.created).to.equal(raw_data1.created);
        done();
      });
  });
  it('/raw_data/:timestamp - DELETE raw_data2', function (done){
    request(app)
      .del('/raw_data/'+raw_data2.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(res.body.created).to.equal(raw_data2.created);
        done();
      });
  });
  it('/raw_data/:timestamp - DELETE raw_data4', function (done){
    request(app)
      .del('/raw_data/'+raw_data4.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(res.body.created).to.equal(raw_data4.created);
        done();
      });
  });

  it('/patients/remove - DELETE', function (done){
    request(app)
      .del('/patients/remove')
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/groups/remove/:groupid- DELETE - remove group', function(done){
    request(app)
      .del('/groups/remove/'+group["_id"])
      .auth(house["email"], house["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/doctors/remove - DELETE', function (done){
    request(app)
      .del('/doctors/remove')
      .auth(house["email"], house["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });

});