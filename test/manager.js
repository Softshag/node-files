

var FileManager = require('../');
var Asset = require('../lib/asset');
var fs = require('fs');

describe('FileManager', function () {

    var file = process.cwd() + '/store_file.json';
    var p = process.cwd() + '/file_test';

    var fm = new FileManager({
        dataStore: {
            type: 'file',
            path: p
        },
        metaStore: {
            type: 'file',
            file: file
        },
        maxSize: 2*1000*1000,
        mimeTypes: ['text/html','image/*']
    });

    var testFile = __dirname + '/fixtures/test.html';
    var key = "blomst/index.html";

    it('should add file from path', function(done) {
        var key = "blomst/index.html";
        fm.add(key,testFile, function (err, file) {
            (err == null).should.be.true;
            file.should.be.instanceOf(Asset);
            file.path.should.be.equal(key);
            file.mime.should.equal('text/html');
            file.name.should.equal('test.html');
            done();
        });

    });

    it('should add file from stream', function(done) {

        var rs = fs.createReadStream(testFile);
        fm.add(key,rs,{name:'rapper.html'}, function (err, file) {
            (err == null).should.be.true;
            file.should.be.instanceOf(Asset);
            file.path.should.be.equal(key);
            file.mime.should.equal('text/html');
            file.name.should.equal('rapper.html');
            done();
        });

    });

    it('should get file', function(done) {
        fm.get(key, function (err, file) {
            (err == null).should.be.true;
            file.should.be.instanceOf(Asset);
            file.path.should.be.equal(key);
            file.mime.should.equal('text/html');
            file.name.should.equal('rapper.html');
            done();
        });
    });

    it('should list all files', function(done) {
        fm.list(function (err, files) {
            (err == null).should.be.true;
            files.should.be.an.Array;
            files.length.should.be.equal(1);
            files[0].should.be.an.instanceOf(Asset);
            done();
        });
    });

    it('should remove a file', function(done) {
        fm.remove(key, function (err) {
            (err == null).should.be.true;

            fm.get(key, function (err, file) {
                (err == null).should.be.true;
                (file == null).should.be.true;
                done();
            });

        });
    });

    it('should check for maxSize', function(done) {
        var image = __dirname + '/fixtures/image.png';

        fm.add('image/image.png', image, function (err, file) {
            (err == null).should.be.false;
            err.should.be.instanceOf(Error);
            done();
        });
    });

    it('should check for mime', function(done) {
        var json = __dirname + '/fixtures/asset.json';

        fm.add('images/asset.json',json, function (err, file) {

            (err == null).should.be.false;
            (file == null).should.be.true;
            err.should.be.instanceOf(Error);
            done();
        });
    });

    it.skip('should not override key', function(done) {

    });
});