module.exports = function ThrottledServer(_options) {
    var output = new require('../output')();
    //Default options
    var options = {
        kbps:100,
        listenPort:80,
        forwardPort:8080,
        forwardHost:"localhost",
        minChunkInterval:10
    }
    
    //Options config
    for(option in _options) {
        options[option] = _options[option];
    }
    
    //Private vars
    var throttledServer; 
    var http = require('http');
    var started = false;
    
    //Private methods
    function throttledResponse(clientRes, throttledReq, throttledRes, dataBuffer) {
        var interval = options.minChunkInterval;
        var chunkNumber = 0;
        var chunkSize = Math.max(parseInt(options.kbps * 1024 / interval,10),1);
        
        throttledRes.writeHead(200, clientRes.headers);
        
        return function() {
            chunkNumber++;
            if(chunkNumber * chunkSize < dataBuffer.length) {
                throttledRes.write(dataBuffer.slice((chunkNumber - 1) * chunkSize, chunkNumber * chunkSize));
                setTimeout(arguments.callee, interval);
            } else {
                throttledRes.end(dataBuffer.slice((chunkNumber - 1) * chunkSize));
                throttledReq.connection.destroy();
            }
        }    
    }


    function getServerData(throttledReq, throttledRes) {
        var clientServerOptions = {
            host : options.forwardHost,
            port : options.forwardPort,
            path : throttledReq.url,
            method : throttledReq.method
        };

        var dataBuffer = new Buffer(0);
        
        
        var client = http.request(clientServerOptions, function(clientRes) {
            clientRes.on('data', function(chunk) {
                if(Buffer.isBuffer(chunk)) dataBuffer = Buffer.concat([dataBuffer,chunk]);
            });
            clientRes.on('end', function() {
                throttledResponse(clientRes, throttledReq, throttledRes, dataBuffer)();
            });
        });
        client.end();
        
    }    
    
    return {
        stop: function() {
            if(started) {
                throttledServer.close();
                started = false;
            } else {
                console.log("server not stoped\n");
            }
        },
        start: function() {
            if(!started) {
                throttledServer = http.createServer(function(throttledReq, throttledRes) {
                    getServerData(throttledReq, throttledRes);
                });
                throttledServer.listen(options.listenPort);
                started = true;
            } else {
                console.log("server not started\n");
            }
        },
        setKbps: function(kbps) {
            options.kbps = kbps;
        },
        toString: function() {
            return "Throttled Server: " + JSON.stringify(options);
        }
    }
}


/*
var connect = require('connect');

var srv1 = connect()
    .use(connect.static(__dirname + '/html'))
    .listen(3001);



var throttler = new Throttler({listenPort:9090, kbps:100});
throttler.start();
throttler.setKbps(100);
*/