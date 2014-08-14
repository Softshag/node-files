#### Add new meta store
    var RedisStore = FileManager.MetaStore.extend('redis',{
        initialize: function (options) {
        
        },
        
        add: function (options, done) {
        
        },
        get: function (key, done) {
        
        },
        remove: function (key, done) {
        
        }
    });
    
    
## Use new meta store
    var fm = new FileManager({
        metaStore: {
            type: "redis"
        }
    });
    
    // OR
    var metaStore = new RedisStore();
    
    var fm = new FileManager({
        metaStore: metaStore
    });
    