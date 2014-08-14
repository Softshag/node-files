
var MetaStore = require('../lib/meta/file');
var Base = require('../lib/meta/meta');
var Asset = require('../lib/asset'),
    fs = require('fs'),
    utils = require('../lib/utils');



describe('File MetaStore', function () {
    var file = process.cwd() + '/store_file.json';

    var assetConfig = require('./fixtures/asset');

    it('should be an instance of BaseMetaStore', function () {
        var store = new MetaStore({file:file});

        store.should.be.instanceOf(Base);
    });

    it('should throw an error if file is not set', function () {
        (function () {new MetaStore()}).should.throw();
    });

    it('should use options', function () {

        var store = new MetaStore({
            file: file
        });

        store.file.should.equal(file);

    });

    it('should add a file', function (done) {
        var store = new MetaStore({
            file: file
        });

        var asset = utils.extend({},assetConfig);
        store.add(asset, function (err,asset) {
            (err === null).should.be.true;

            store._data.should.have.property(asset.path);
            store._data[asset.path].should.have.properties(asset);
            done();
        })

    });

    it('should get a file', function (done) {
        var store = new MetaStore({
            file: file
        });

        store.get(assetConfig.path, function (err, asset_config) {
            (err === null).should.be.true;
            (asset_config !== null).should.be.true;
            asset_config.should.have.properties(assetConfig);
            done();
        });
    });

    it('should not get file', function (done) {
        var store = new MetaStore({
            file: file
        });

        store.get("path which doesn't exists", function (err, asset_config) {
            (err === null).should.be.true;
            (asset_config == null).should.be.true;
            done();
        });
    })

    it('should delete a file', function (done) {
        var store = new MetaStore({
            file: file
        });

        store.remove(assetConfig.path, function (err, asset_config) {
            (err === null).should.be.true;
            (asset_config == null).should.be.true;

            store._data.should.not.have.property(assetConfig.path);
            done();
        });
    });

    it('should get list of file', function (done) {
        var store = new MetaStore({
            file: file
        });

        var asset = utils.extend({},assetConfig);

        store.add(asset, function (err) {
            store.get(null, function (err, assets) {
                (err === null).should.be.true;
                (assets !== null).should.be.true;
                assets.should.be.an.Array;
                assets.length.should.equal(1);
                assets[0].should.have.properties(assetConfig);
                done();
            });
        });


    });

});