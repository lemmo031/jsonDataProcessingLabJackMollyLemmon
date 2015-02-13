/**
 * Created by grove266 on 2/10/15.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StudentSchema = new Schema({

  firstName: String,
  lastName: String,
  dateOfBirth: String,
  gender: String,
  email: String,
  phone: String,
  address: String,
  //courses: [],
  major1: String,
  major2: String

});

module.exports = mongoose.model('Student', StudentSchema);
