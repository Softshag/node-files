
var FileManager = require('../lib');
var DataBase = require('../lib/data/data');
var utils = require('../lib/utils');
var fs = require('fs');
var Stream = require('stream').Stream;

var desc = function(name, desc) {
    if (!desc) desc = ""
    return "" + name + " " + desc
}

describe('Data Stores', function () {

    var dataStores = FileManager.DataStore.stores;


    var assetConfig = require('./fixtures/asset');


    Object.keys(dataStores).forEach(function (dataStoreName) {
        var Store = dataStores[dataStoreName];



        describe(desc(dataStoreName.toUpperCase() + " Store"), function () {

            var opt = {};

            if (dataStoreName === 'file') {
                opt = {path: process.cwd() + '/file_test'}
            } else if (dataStoreName === 's3') {
                opt = require('./auth');
            }


            it('should be an instance of DataBase ' , function () {
               var store = new Store(opt);

              store.should.be.an.instanceOf(DataBase);
            });

            it('should add a file', function (done) {
                var store = new Store(opt);
               utils.lookup(process.cwd() + '/test/fixtures/test.html', function (err, stat) {

                   store.add(assetConfig.path, stat, function (err,asset) {

                        (err == null).should.be.true;
                        (asset !== null).should.be.true;

                        done();
                    });
                });

            });

            it('should get an url from key', function (done) {
                var store = new Store(opt);

                store.getURL(assetConfig.path, function (err, url) {

                    (err === null).should.be.true;
                    url.should.be.String;
                    done();
                });
            });

            it('should get an stream from key', function (done) {
                var store = new Store(opt);

                store.getStream(assetConfig.path, function (err, stream) {
                    (err == null).should.be.true;
                    stream.should.be.instanceOf(Stream);
                    done();
                });
            });

            it('should remove file from store', function (done) {
               var store = new Store(opt);

               store.remove(assetConfig.path, function (err) {

                   (err == null).should.be.true;

                   store.getURL(assetConfig.path, function (err, url) {
                       (err == null).should.be.true;
                       (url == null).should.be.true;
                       done();
                   })
               })
            });
        })

    })

})