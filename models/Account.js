'use strict';
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var accountSchema = new Schema({
    username: String,
    password: String
});


module.exports = mongoose.model('Account', accountSchema, "accounts")