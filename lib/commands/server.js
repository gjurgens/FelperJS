module.exports = function(settings, processList) {
    var rules = {};
    
    
    function list(args) {
        processList.list();
    }
    
    function serverStart(args) {
    	console.log('Server Start: ' + args)
    }
    
    function serverStop(args) {
    	console.log('Server Stop: ' + args)
    }
    
    function add(name) {
        var server = new require('../processes/throttledserver')();
        var process = new require('../processes/process')(processList, server);
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
	                        "action": list,
	                    },
	                    "add": {
	                        "description": "Stop static server",
	                        "action": add,
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