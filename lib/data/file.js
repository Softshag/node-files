var util = require('util'),
    Base = require('./data'),
    utils = require('../utils');
var mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs'),
    crypto = require('crypto');

var FileDataStore;
/**
 * @constructor
 * @extends DataStore.BaseDataStore
 * @memberof DataStore
 */
var FileDataStore = function FileDataStore (options) {
    Base.prototype.constructor.call(this, options);

    utils.extend(this,utils.pick(options,['path']));

    if (!this.path)
        throw new Error('No path specified!');

};

util.inherits(FileDataStore,Base);


FileDataStore.prototype.add = function (key, obj, done) {
    var filePath = obj.path;

    keyPath =createHash.call(this,key);

    ws = fs.createWriteStream(keyPath);

    ws.on('close', function () {
        done(null, obj);
    });

    fs.createReadStream(filePath).pipe(ws);

};

FileDataStore.prototype.remove = function (key, done) {
    var keyPath = createHash.call(this, key);
    if (fs.existsSync(keyPath)) {
        fs.unlink(keyPath, done);
    } else {
        done();
    }
};

FileDataStore.prototype.get = function (key) {

};

FileDataStore.prototype.getStream = function (key, done) {
   var p = createHash.call(this, key);
   fs.exists(p, function (ret) {

       if (!ret)
        return done();

       done(null, fs.createReadStream(p));
   });
};

FileDataStore.prototype.getURL = function (key, done) {
    var p = createHash.call(this, key);
    fs.exists(p, function (ret) {

        if (!ret)
            return done();

        done(null, p);
    });
};

function createHash (key) {
    var hash = crypto.createHash('sha1').update(key,'utf-8').digest('hex');
    return path.join(this.path,hash);
}

//


module.exports = FileDataStore;