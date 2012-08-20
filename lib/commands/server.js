module.exports = function() {
    function list(args) {
        console.log("List: " + args);
    }
    
    function serverStart(args) {
    	console.log('Server Start: ' + args)
    }
    
    function serverStop(args) {
    	console.log('Server Stop: ' + args)
    }
    
    return {
        "menu": {
            "commands": {
                "server": {
                    "description": "Server commands.",
                    "action": list,
                    "commands": {
                        "start": {
                            "description": "Start static server",
                            "action": serverStart,
                        },
	                    "stop": {
	                        "description": "Stop static server",
	                        "action": serverStop,
	                        
	                    },
	                    "monitor": {
	                        "description": "Stop static server",
	                        "action": serverStop,
	                        
	                    },
	                    "list": {
	                        "description": "Stop static server",
	                        "action": serverStop,
	                        
	                    },
	                    "add": {
	                        "description": "Stop static server",
	                        "action": serverStop,
	                        
	                    },
	                    "edit": {
	                        "description": "Stop static server",
	                        "action": serverStop,
	                        
	                    },
	                    "remove": {
	                        "description": "Stop static server",
	                        "action": serverStop,
	                        
	                    }
                    }
                }
            }
        }
    };
};