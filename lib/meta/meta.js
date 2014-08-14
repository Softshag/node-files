/** @namespace MetaStore */

var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var Base;

/**
 * @class
 * @extends EventEmitter
 */
Base = function Base (options) {
    if (this.initialize) {
        this.initialize(options);
    }
};

util.inherits(Base,EventEmitter);


/**
 * Add a file to the meta store
 * @param {object} asset
 * @param {string} asset.name
 * @param {string} asset.path
 * @param {string} asset.mime
 * @param {number} asset.size
 * @param {Callback} done
 */
Base.prototype.add = function (obj,done) {

};

/**
 *
 * @param key
 * @param done
 */
Base.prototype.remove = function (key,done) {

};

/**
 *
 * @param key
 * @param done
 */
Base.prototype.get = function (key, done) {

};


module.exports = Base;
