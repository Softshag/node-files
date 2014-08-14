/**
 * Created by rasmus on 8/13/14.
 */

var Asset = require('../lib/asset');

'use strict'


describe('File', function () {
    var assetConfig = require('./fixtures/asset.json');
    var props = ['name','size','path','mime'];

    it('should defineProperties', function () {
        var asset = new Asset(null,assetConfig);
        asset.should.have.properties({
            name: assetConfig.name,
            path: assetConfig.path,
            mime: assetConfig.mime,
            size: assetConfig.size
        });
    });

    it('should not have writable properties', function () {
        var asset = new Asset(null,assetConfig);

        props.forEach(function (prop) {
            asset[prop] = "random_data";
            asset[prop].should.be.equal(assetConfig[prop]);
        });
    })


    it('should get properties via #get', function () {
        var asset = new Asset(null,assetConfig);

        props.forEach(function (key) {
            asset.get(key).should.equal(assetConfig[key]);
        });
    });

    it('should not set properties via #set', function () {
        var asset = new Asset(null, assetConfig);

        props.forEach(function (key) {
            asset.set.bind(null,key,assetConfig[key]).should.throw();

        });
    });

    it('should set additional properties via #set', function () {
        var asset = new Asset(null, assetConfig);

        asset.set('random_key',"random_data");
        asset._attributes.should.have.property('random_key','random_data');
    });

    it('should get additional properties via #get', function () {
        var asset = new Asset(null, assetConfig);

        asset.get('random_key', function (err, value) {
            (err === null).should.be.true;
            value.should.equeal('random_data');
        });
    });
});