'use strict';

var request = require('supertest');
var mongoose = require('mongoose');
var expect = require("chai").expect;
var S = require("string");

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

// import diet
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

describe('PATIENT TEST', function(){
  //raw data remove
  it('/raw_data/:timestamp - DELETE raw_data1', function (done){
    request(app)
      .del('/raw_data/'+raw_data1.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('jm does not exists')).to.be.true;
        else
          expect(res.body.created).to.equal(raw_data1.created);
        done();
      });
  });
  it('/raw_data/:timestamp - DELETE raw_data2', function (done){
    request(app)
      .del('/raw_data/'+raw_data2.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        if (res.body['error']) 
          expect(S(res.body['error']).startsWith('jm does not exists')).to.be.true;
        else
          expect(res.body.created).to.equal(raw_data2.created);
        done();
      });
  });
  // removes data
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
  // removes group
  it('/groups/remove/:groupid - DELETE', function(done){
    request(app)
      .del('/groups/remove/'+type_i_diabetes["_id"])
      .auth(lipschitz["email"], lipschitz["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/groups/remove/:groupid - DELETE', function(done){
    request(app)
      .del('/groups/remove/'+type_ii_diabetes["_id"])
      .auth(lipschitz["email"], lipschitz["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/groups/remove/:groupid - DELETE', function(done){
    request(app)
      .del('/groups/remove/'+cancer["_id"])
      .auth(lipschitz["email"], lipschitz["pass"])
      .end(function (err, res){
        expect(res.status).to.not.equal(401);
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });

  // remove doctor
  it('/doctors/remove - DELETE', function (done){
    request(app)
      .del('/doctors/remove')
      .auth(lipschitz["email"], lipschitz["pass"])
      .end(function (err, res){
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

  // remove diet (must be before patient removal)
  it('/diet/:timestamp - DELETE', function (done){
    request(app)
      .del('/diet/'+diet1.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        expect(res.status).to.not.equal(401);
        done();
      });
  });
  it('/diet/:timestamp - DELETE', function (done){
    request(app)
      .del('/diet/'+diet2.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        expect(res.status).to.not.equal(401);
        done();
      });
  });
  it('/diet/:timestamp - DELETE', function (done){
    request(app)
      .del('/diet/'+diet3.created)
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        expect(res.status).to.not.equal(401);
        done();
      });
  });

  // remove patients
  it('/patients/remove - DELETE jeremy', function (done){
    request(app)
      .del('/patients/remove')
      .auth(jeremy['email'], jeremy["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE jm', function (done){
    request(app)
      .del('/patients/remove')
      .auth(jm['email'], jm["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE barrack', function (done){
    request(app)
      .del('/patients/remove')
      .auth(barrack['email'], barrack["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE oprah', function (done){
    request(app)
      .del('/patients/remove')
      .auth(oprah['email'], oprah["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE marisa', function (done){
    request(app)
      .del('/patients/remove')
      .auth(marisa['email'], marisa["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE michelle', function (done){
    request(app)
      .del('/patients/remove')
      .auth(michelle['email'], michelle["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
  it('/patients/remove - DELETE samuel', function (done){
    request(app)
      .del('/patients/remove')
      .auth(samuel['email'], samuel["pass"])
      .end(function (err, res){
        expect(Object.keys(res.body).length).to.not.equal(0);
        done();
      });
  });
});