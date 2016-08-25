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
var data1 = require('./data/data1.json');
var data2 = require('./data/data2.json');
var data3 = require('./data/data3.json');
var data4 = require('./data/data4.json');
var data5 = require('./data/data5.json');
var data6 = require('./data/data6.json');
var data7 = require('./data/data7.json');

describe('PROCESSED DATA TEST', function(){
  it('/doctors - POST - (create doctor house)', function (done){
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
          expect(S(res.body['error']).startsWith('jm already exists')).to.be.true;
        else
          expect(res.body['email']).to.equal(jm['email']);
        done();
      });
  });

  it('/data - POST - (create data1)', function (done){
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
  it('/data - POST - (create data3) - true negative - repeating timestamp', function (done){
    request(app)
      .post('/data')
      .auth(jm['email'], jm["pass"])
      .send(data3)
      .end(function (err, res){
        expect(err).to.not.equal(undefined);
        expect(err).to.not.equal(null);
        done();
      });
  });
  it('/data - POST - (create data4) - true negative - misspelled activity', function (done){
    request(app)
      .post('/data')
      .auth(jm['email'], jm["pass"])
      .send(data4)
      .end(function (err, res){
        expect(err).to.not.equal(undefined);
        expect(err).to.not.equal(null);
        done();
      });
  });
  it('/data - POST - (create data5) - true negative - missing data field', function (done){
    request(app)
      .post('/data')
      .auth(jm['email'], jm["pass"])
      .send(data5)
      .end(function (err, res){
        expect(err).to.not.equal(undefined);
        expect(err).to.not.equal(null);
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
          expect(res.body['email']).to.equal(data4['email']);
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
          expect(res.body['email']).to.equal(data4['email']);
        done();
      });
  });

  it('/data - GET all data', function (done){
    request(app)
      .get('/data')
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(res.body.length).to.equal(4);
        done();
      });
  });
  it('/data/:timestamp - GET all data', function (done){
    request(app)
      .get('/data/'+data1.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(res.body.email).to.equal(data1.email);
        done();
      });
  });  

  it('/data/:timestamp - DELETE data1', function (done){
    request(app)
      .del('/data/'+data1.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(res.body.created).to.equal(data1.created);
        done();
      });
  });
  it('/data/:timestamp - DELETE data2', function (done){
    request(app)
      .del('/data/'+data2.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(res.body.created).to.equal(data2.created);
        done();
      });
  });
  it('/data/:timestamp - DELETE data6', function (done){
    request(app)
      .del('/data/'+data6.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(res.body.created).to.equal(data6.created);
        done();
      });
  });
  it('/data/:timestamp - DELETE data7', function (done){
    request(app)
      .del('/data/'+data7.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(res.body.created).to.equal(data7.created);
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