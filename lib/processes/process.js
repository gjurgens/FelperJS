module.exports = function Process(processList, handler, processType) {
    var pid = null;
    
    var process = {
        start: function() {
            if(typeof handler.start === "function") {
                return handler.start();                
            } else {
                console.log("Current handler does not implement a start method.");
                return false;
            }
        },
        stop: function() {
            if(typeof handler.stop === "function") {
                return handler.stop();                
            } else {
                console.log("Current handler does not implement a stop method.");
                return false;
            }
        },
        kill: function() {
            if (this.stop()) {
                processList.remove(pid);            
                console.log("process PID: " + pid + ", killed.");
            } else {
                console.log("ERROR: could not kill process: " + pid);
            }
        },
        getHandler: function(){
            return handler;
        },
        toString: function() {
            return handler.toString() + " (PID:" + pid + ")";
        },
        type: processType,
        saveSettings: function() {
            if(typeof handler.saveSettings === "function") {
                return handler.saveSettings();                
            } else {
                return false;
            }
        }
    }

    pid = processList.add(process);
    
    console.log("Process assigned PID: " + pid);
    
    return process;
    
}
