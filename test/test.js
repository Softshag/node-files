
var fs = require('fs');
var rimraf = require('rimraf');

var file = process.cwd() + '/store_file.json';
var p = process.cwd() + '/file_test';

before(function (done) {

   if (fs.existsSync(file)) {
       fs.unlinkSync(file);
   }

    if (!fs.existsSync(p)) {
        fs.mkdirSync(p);
        done();
    } else {
        rimraf(p, function () {
            fs.mkdirSync(p);
            done();
        })
    }
});


after(function (done) {
    if (fs.existsSync(file))
        fs.unlinkSync(file);
    rimraf(p,done);
});
