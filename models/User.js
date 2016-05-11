'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.models = {};
mongoose.modelSchemas = {};
module.exports = mongoose.model('User', {
    fb: {
        id: String,
        access_token: String,
        firstName: String,
        lastName: String
    },
    local: {
        id: String,
        username: String,
        password: String
    },
    soundcloud: {
        id: String,
        access_token: String
    }

});