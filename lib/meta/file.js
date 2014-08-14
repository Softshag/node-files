

var util = require('util'),
    Base = require('./meta'),
    utils = require('../utils'),
    path = require('path'),
    fs = require('fs');

var FileMetaStore;
/**
 * @constructor
 * @param {Object} options
 * @param {string} options.file
 * @extends MetaStore.Base
 * @throws Throw an error, if file not set
 * @memberof MetaStore
 */
FileMetaStore = function FileMetaStore (options) {
    if (!options) {
        options = {};
    }

    Base.prototype.constructor.call(this, options);

    utils.extend(this, utils.pick(options, ['file']));

    if (!this.file) {
        throw new Error('File not set');
    }

    readFile.call(this);
};

util.inherits(FileMetaStore,Base);

/**
 * Add a file to the meta store
 * @param {object} asset
 * @param {string} asset.name
 * @param {string} asset.path
 * @param {string} asset.mime
 * @param {number} asset.size
  * @param done
 */
FileMetaStore.prototype.add = function (asset, done) {
   this._data[asset.path] = asset;

   writeFile.call(this);
   done(null,this._data[asset.path]);
};

FileMetaStore.prototype.remove = function (key, done) {
   var err = null;

   if (this._data[key])
    delete this._data[key];
   else
    err = new Error('Key not found');

   writeFile.call(this);

   done(err);
};



FileMetaStore.prototype.get = function (key, done) {
    if (!key) {
        var self = this;
        var values = Object.keys(this._data).map(function(key){

            return self._data[key];
        });

        return done(null,values);
    }

    done(null,this._data[key]);
};

function readFile () {
    if (fs.existsSync(this.file))
        this._data = JSON.parse(fs.readFileSync(this.file,'utf-8'));
    else
        this._data = {};
}

function writeFile () {
    fs.writeFileSync(this.file,JSON.stringify(this._data));
}


module.exports = FileMetaStore;