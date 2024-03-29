module.exports = function(settings, processList) {    
    const processType = "forwarder";
    function list(args) {
        processList.list();
    }
    
    function start(args) {
        var process = processList.getProcess(args);
        if(process && typeof process.start === "function") {
            process.start();
            return true;
        } else {
            console.log("Could not start server PID: " + args);
            return false;
        }    	
    }
    
    function stop(args) {
        var process = processList.getProcess(args);
        if(process && typeof process.stop === "function") {
            process.stop();
            return true;
        } else {
            console.log("Could not stop server PID: " + args);
            return false;
        }       
    }
    
    function add(args) {
        var params = args.split(" ");
        var serverOptions = {};
        
        if(params.length > 0 && params[0] !== "") serverOptions.listenPort = params[0];
        if(params.length > 1) serverOptions.forwardHost = params[1];
        if(params.length > 2) serverOptions.forwardPort = params[2];
        if(params.length > 3) serverOptions.kbps = params[3];
        
        var server = new require('../processes/throttledserver')(serverOptions);
        var process = new require('../processes/process')(processList, server, processType);
    } 
    
    function kill(args) {
        var process = processList.getProcess(args);
        if(process && typeof process.kill === "function") {
            process.kill();
        } else {
            console.log("Could not kill process: " + args);
        }
    }
    
    function saveSettings() {
        
    }
    
    function loadSettings() {
        if(settings.get().commands[processType]) {
            for(var i = 0; i < settings.get().commands[processType].length; i++) {
                //do load
            }            
        }
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
                            "action": start
                        },
	                    "stop": {
	                        "description": "Stop static server",
	                        "action": stop
	                    },
	                    "monitor": {
	                        "description": "Stop static server",
	                        "action": stop
	                    },
	                    "list": {
	                        "description": "Stop static server",
	                        "action": list
	                    },
	                    "add": {
	                        "description": "Stop static server",
	                        "action": add,
                            "params":[
                                      {"name":"LISTEN_PORT", "required": true, "description":"INTEGER: Port for incomming conections."},
                                      {"name":"FORWARD_HOST", "required": true, "description":"STRING: Destination host of requests."},
                                      {"name":"FORWARD_PORT", "required": true, "description":"INTEGER: Destination port of requests."},
                                      {"name":"KBPS", "required": false, "description":"FLOAT: Maximum speed in kilobytes per seccond of forwarded connection."}
                            ]
	                    },
	                    "edit": {
	                        "description": "Stop static server",
	                        "action": stop
	                    },
	                    "kill": {
	                        "description": "Stop static server",
	                        "action": kill
	                    }
                    }
                }
            }
        },
        "saveSettings": function() {
            return saveSettings();
        },
        "loadSettings": function() {
            return loadSettings();
        },
        "processType":processType
    };
};