/**
 * Created by grove266 on 2/10/15.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StudentSchema = new Schema({

  //need to create the student model from our existing seed.

  //name: String,
  //info: String,
  //active: Boolean
});

module.exports = mongoose.model('Student', StudentSchema);
