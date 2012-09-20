module.exports = function(settings, processList) {
	var calls = 0;
    function proxy(args) {
    	calls++;
        console.log("Proxy: " + calls + ": " + args);
    }
    
    function proxyStart(args) {
    	console.log('Proxy Start: ' + args)
    }
    
    function proxyStop(args) {
    	console.log('Proxy Stop: ' + args)
    }
    
    return {
        "menu": {
            "commands": {
                "proxy": {
                    "description": "Server commands.",
                    "action": proxy,
                    "commands": {
                        "start": {
                            "description": "Start Proxy",
                            "action": proxyStart,
                        },
	                    "stop": {
	                        "description": "Stop Proxy",
	                        "action": proxyStop,
	                        
	                    }
                    }
                }
            }
        }
    };
};