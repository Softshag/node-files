var util = require('util'),
    Base = require('./data'),
    utils = require('../utils');
var mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs'),
    crypto = require('crypto');

var Knox = require('knox');

var S3DataStore;


/**
 * @constructor
 * @extends DataStore.BaseDataStore
 * @memberof DataStore
 */
var S3DataStore = function S3DataStore (options) {
    var defaults = {
        "private": true,
        "headers": {}
    };

    if (!options) {
        this.options = utils.extend(defaults,options);
    } else {
        this.options = defaults;
    }

    Base.prototype.constructor.call(this, options);

    var keys = ['key','secret','bucket'];

    var self = this;

    keys.forEach(function (key) {
        if (!options[key])
            throw new Error('The field: "' + key + '" is required!');
    });

    this.knox = Knox.createClient(options);

};


util.inherits(S3DataStore,Base);

S3DataStore.prototype.add = function (key, obj,done) {

    if (!obj) {
        obj = {};
    }

    var headers = utils.extend({},{
        'Content-Type': obj.mime,
        'Content-Length': obj.size
    });

    var filePath = obj.path;

    var pri = true;

    if (obj.hasOwnProperty('private')) {
        pri = obj.private;
    } else {
        pri = this.options.private;
    }

    if (pri === false) {
        headers["x-amz-acl"] = 'public-read';
    }

    if (obj.hasOwnProperty('headers')) {
        utils.extend(headers,obj.headers);
    }

    var req = this.knox.put(key, headers);

    var ws = fs.createReadStream(filePath);
    ws.pipe(req);

    req.on('response', function (res) {
       if (res.statusCode === 200) {
           return done();
       }
       done(new Error('Could not upload file to s3'));
    });

    req.on('error', done);

};

S3DataStore.prototype.remove = function (key, done) {
    this.knox.deleteFile(key, function (err, res) {
        if (err) return done(err);
        res.resume();
        done();
    });
};


S3DataStore.prototype.getStream = function (key, done) {
    this.knox.getFile(key, function (err, res) {
        if (err) return done(err);
        done(null,res);
    });
};

S3DataStore.prototype.getURL = function (key, done) {
    var self = this;
    this.knox.headFile(key, function (err, res) {
        if (err) return done(err);

        if (res.statusCode === 200) {
            done(null,self.knox.https(key));
        } else {
            done();
        }
    });

};


module.exports = S3DataStore;