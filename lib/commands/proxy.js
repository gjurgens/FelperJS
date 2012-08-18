module.exports = function() {
    function proxy(args) {
        console.log("Proxy: " + args);
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
                },
	            "server": {
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