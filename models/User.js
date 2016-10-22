'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.models = {};
mongoose.modelSchemas = {};
module.exports = mongoose.model('User', {
    fb: {
        id: String,
        access_token: String,
        refresh_token: String,

        firstName: String,
        lastName: String
    },
    local: {
        id: String,
        username: String,
        password: String,
        soundcloud: {
            id: String,
            access_token: String,
            refresh_token: String,
            expires_in: Number
        },
        facebook:{
            id: String,
            access_token: String,
            page_token: String,
            page_id: String,
            firstName: String,
            lastName: String
        }
    },
    soundcloud: {
        id: String,
        access_token: String,
        refresh_token: String,
        expires_in: Number
    },
    beatport:{
        id: String,
        access_token: String,
        access_token_secret: String
    },
    twitter:{
        id: String,
        access_token: String,
        access_token_secret: String

    },
    youtube: {
        id: String,
        access_token: String,
        access_token_secret: String,
        refresh_token: String,
        expires_in: Number
        
    }

});