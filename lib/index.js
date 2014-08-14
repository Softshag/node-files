
var Mime = require('mime');
var Stream = require('stream').Stream;
var temp = require('temp');
var path = require('path'),
    fs = require('fs'),
    Asset = require('./asset'),
    Extend = require('./extend'),
    MetaStore = require('./meta/meta'),
    DataStore = require('./data/data');

var defaults = {
    override: true
};

var FileManager;

/**
 * @tutorial filemanager
 * @name FileManager
 * @param {Object} options
 * @param {boolean} options.override
 * @param {object|function} options.dataStore
 * @param {object|function} options.metaStore
 * @param {number} options.maxSize default: 5242880 (5mb)
 * @param {string|array} options.mimeTypes defaults to '*' (all). Can be an array or a string
 * @constructor
 * @example
 * var fm = new FileManager({
 *  override: true,
 *  maxSize: 200000,
 *  mimeTypes: ['image/*','text/html', 'application/json'],
 *  dataStore: {
 *    type: 'file',
 *    path: process.cwd() + '/files',
 *  },
 *  metaStore: {
 *    type: 'file',
 *    file: process.cwd() + '/files.json'
 *  }
 * });
 */
FileManager =  function FileManager (options) {
    var defaults = {
        maxSize: 5242880, // bytes
        mimeTypes: '*' // Allow all types
    };
    if (options) {
        this.options = utils.extend(defaults,options);
    } else {
        this.options = defaults;
    }

    var Store, o;
    if (options.hasOwnProperty('dataStore')) {

        o = options.dataStore;

        if (o instanceof DataStore) {
            this._dataStore = o;
        } else {
            Store = FileManager.DataStore.stores[o.type];
            if (Store) {
                this._dataStore = new Store(o);
            }
        }
    }

    if (!this._dataStore) {
        Store = FileManager.DataStore.stores.file;
        this._dataStore = new Store({
            path: './file_test'
        });
    }

    if (options.hasOwnProperty('metaStore')) {
        o = options.metaStore;

        if (o instanceof MetaStore) {
            this._dataStore = o;
        } else {
            Store = FileManager.MetaStore.stores[o.type];
            if (Store) {
                this._metaStore = new Store(o);
            }
        }
    }

    if (!this._metaStore) {
        Store = FileManager.MetaStore.stores.file;
        this._metaStore = new Store();
    }

};



FileManager.DataStore = {
    stores: {
        'file': require('./data/file'),
        's3': require('./data/s3')
    },
    extend: function (name,protoProps, staticProps) {
        var child = Extend(require('./data/data'))(protoProps, staticProps);
        this.stores[name] = child;
    }
};

FileManager.MetaStore = {
    stores: {
        'file' : require('./meta/file')
    },
    extend: function (name,protoProps, staticProps) {
        var child = Extend(require('./meta/meta'))(protoProps, staticProps);
        this.stores[name] = child;
    }
};


/**
 * Add a file to the filestore. The file argument can be a file path or a readable stream.
 * @param {string|stream} file A file path, url or stream.
 * @param {object} options
 * @param {string} options.name
 * @param {number} options.maxSize
 * @param {boolean} options.override
 * @param {string|array} options.mimeTypes
 * @param {Callback} done An callback
 * @throws If the provided file parameter is a stream and no name is provided,
 * an exception will be raised.
 *
 * @example
 * fm.add('path/key', 'filename.txt', function (err, file) {
 *     file.getStream().pipe(fs.createWriteStream(...));
 * });
 *
 */
FileManager.prototype.add = function (key, file, options, done) {
    var _this = this;
    if (typeof options == 'function') {
        done = options;
        options = null;
    }

    if (!options) {
        options = {};
    }

    if (file instanceof Stream) {

        if (!options.hasOwnProperty('name')) {
            throw new Error('Name is missing');
        }

        var ws = temp.createWriteStream({
            suffix: path.extname(options.name)
        });


        ws.on('error', function (err) {
            done(err);
        });

        ws.on('close', function () {

            add.call(_this, key, ws.path, options, done);
        });

        file.pipe(ws);
    } else {
        add.call(_this, key, file, options, done);
    }


};
/**
 * Remove a file from the filemanager.
 * @param {string} key
 * @param {Callback} done
 */
FileManager.prototype.remove = function (key, done) {
    var self = this;
    this._dataStore.remove(key, function (err) {
        if (err)
            return done(err);
        self._metaStore.remove(key,done);
    });

};

/**
 * Get a file from the store
 * @param {string} key See {@link MetaStore.Base}
 * @param {Callback} done
 */
FileManager.prototype.get = function (key,done) {
    var self = this;
    this._metaStore.get(key, function (err, asset) {
        if (err)
            return done(err);
        if (!asset)
            return done();
        asset = new Asset(self, asset);
        done(null, asset);
    });
};

/**
 * Find a file
 * @param query
 * @param done
 */
FileManager.prototype.find = function(query, done) {

};

/**
 * List all files
 * @param {Callback} done
 */
FileManager.prototype.list = function (done) {
    var self = this;
    this._metaStore.get(null, function (err, assets) {
        if (err)
            return done(err);

        assets = assets.map(function (asset) {
            return new Asset(self,asset);
        });
        done(null, assets);
    });
};

/**
 * @private
 * @param {string} key The key of the file
 * @param {string} file Local path to the image
 * @param {object} options
 * @param {string} options.name
 * @param done
 */
var add = function add(key, file, options, done) {

    var _this = this;
    utils.lookup(file, function (err, stat) {
        if (err) return done(err);

        if (options.name) {
           stat.name = options.name;
        } else {
           stat.name = path.basename(file);
        }


        var maxSize = options.maxSize || _this.options.maxSize;
        var mimeTypes = options.mimeTypes || _this.options.mimeTypes;

        if (!checkMime(stat, mimeTypes)) {
            return done(new Error('Wrong file format'));
        }

        if (stat.size > maxSize) {
            return done(new Error('File to large'));
        }

        _this._dataStore.add(key, stat, function (err) {
            if (err) return done(err);

            stat.path = key;

            _this._metaStore.add(stat, function (err) {

                var asset = new Asset(_this,stat);

                done(err, asset);
            });
        });
    });
};
/**
 * @private
 * @param {Object} stat
 * @param {string|array} mimeType
 * @returns {boolean}
 */
var checkMime = function (stat, mimeType) {

    if (mimeType === '*') return true;

    if (Array.isArray(mimeType)) {
         for (var i in mimeType) {
             var mime = mimeType[i];
             if (checkMime(stat, mime)) return true;
         }
    } else {

        if (mimeType.indexOf('/*') > -1) {
            var reg = new RegExp(mimeType.replace('/*','/') + '.*', 'i');

            if (reg.test(stat.mime)) return true;
        } else {
            if (mimeType.toLowerCase() === stat.mime.toLowerCase()) return true;
        }
    }
    return false;
};



module.exports = FileManager;

/**
 * This callback is displayed as part of the Requester class.
 * @callback Callback
 * @param {Error} error
 * @param {mixed} result
 */
