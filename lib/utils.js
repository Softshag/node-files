var slice = Array.prototype.slice;
var concat = Array.prototype.concat;
var ArrayProto = Array.prototype;
var fs = require('fs');
exports.extend = function(obj) {
    slice.call(arguments, 1).forEach(function(source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};

exports.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    keys.forEach(function(key) {
        if (key in obj) copy[key] = obj[key];
    });
    return copy;
};

exports.lookup = function lookup (file_path,done) {

    fs.stat(file_path, function (err, stats) {
        if (err)
            return done(err);

        var opt = {
            mime: Mime.lookup(file_path),
            size: stats.size,
            path: file_path
        };
        done(null,opt);
    });
};


exports.forEachParallel = function (array, fn, callback) {
    var completed = 0;
    if(array.length === 0) {
        callback(); // done immediately
    }
    var len = array.length;
    for(var i = 0; i < len; i++) {
        fn(array[i], function() {
            completed++;
            if(completed === array.length) {
                callback();
            }
        });
    }
};


var Mime;
exports.mime = Mime = require('mime');