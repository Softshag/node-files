


#### Initialize
    var fm = new FileManager({
        dataStore: {
            type: "file",
            path: "./files"
        },
        metaStore: {
            type: "file",
            path: "./files.json"
        },
        mimeTypes: ['image/*','text/*'],
        maxSize: 500000
    });
    
#### Add a file

    var rs = fs.createReadStream('./image.png');
    
    fm.add('images/image1.png',rs,function (err, file) {
        if (err) throw err;
        
        console.log(file); // {name:'image.png',path:'images/image1.png",mime:'images/png',size:2020}
    });
    
    
#### Get a file

    fm.get('images/image1.png', function(err, file) {
        if (err) throw err;
        
        file.getURL(function (err, url) {
            console.log(url);
        }); 
        
        file.getStream(function (err, stream) {
            stream.pipe(fs.createWriteStream('file.png'));
        });
    });
    
    // OR
    
    fm.get('images/image1.png', function(err, file) {
        if (err) throw err;
        
        file.pipe(fs.createWriteStream('file.png');
    });
    