/** @namespace DataStore */

var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var BaseDataStore;

/**
 * @constructor
 * @augments EventEmitter
 * abstract
 * @memberof DataStore
 */
var BaseDataStore = function BaseDataStore (options) {
    this.options = options;
    if (this.initialize) {
        this.initialize(options);
    }
};

util.inherits(BaseDataStore,EventEmitter);


/**
 * Add a file to the store
 * @param {string} key
 * @param {Object} obj
 * @param {string} obj.path
 * @param done
 */
BaseDataStore.prototype.add = function (key, obj, done) {

};

/**
 * s
 * @param key
 * @param done
 */
BaseDataStore.prototype.remove = function (key, done) {

};

BaseDataStore.prototype.get = function (key, done) {
    this.getURL(key, done);
};

BaseDataStore.prototype.getStream = function (key, done) {

};

BaseDataStore.prototype.getURL = function (key, done) {

};

//


module.exports = BaseDataStore;