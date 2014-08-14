var utils = require('./utils');

var File;

var props = ['name','size','mime','path'];
/**
 *
 * @param {FileManager} manager
 * @param attr
 * @param options
 * @property {string} name
 * @property {string} mime
 * @property {number} size
 * @property {string} path
 * @constructor
 */
File = function File (manager, attr, options) {

    this.manager = manager;
    this._attributes = utils.extend({},attr);
    var self = this;
    props.forEach(function (key) {
       if (!attr.hasOwnProperty(key) && attr[key] !== null)
        throw new Error(key + " is not set");

        Object.defineProperty(self,key,createProp(self,key));
    });

};

File.prototype.set = function (key,value) {
  if (props.indexOf(key) > 0) {
      throw new Error('cannot set "' + key + '" that field is write protected');
  }
  this._attributes[key] = value;
};

File.prototype.get = function (key) {
    return this._attributes[key];
};

File.prototype.getStream = function (done) {
    this.manager._dataStore.getStream(this.path,done);
};

File.prototype.pipe = function (ws) {
    this.manager._dataStore.getStream(this.path, function (err, stream) {
        stream.pipe(ws);
    });
};

File.prototype.getURL = function (done) {
    this.manager._dataStore.getURL(this.path,done);
};

File.prototype.toJSON = function () {
  return this._attributes;
};

function createProp (obj, prop) {
    return {
        value: obj._attributes[prop],
        write: false,
        enumerable: true
    };
}



module.exports = File;