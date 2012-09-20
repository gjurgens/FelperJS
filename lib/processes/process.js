module.exports = function Process(processList, handler) {
    var pid = null;
    
    var process = {
        start: function() {
            console.log("start: " + pid);
        },
        stop: function() {
            console.log("stop: " + pid);
        },
        kill: function() {
            console.log("kill: " + pid);
            this.stop();
            processList.remove(pid);            
        },
        getHandler: function(){
            return handler;
        },
        toString: function() {
            return handler.toString() + " (PID:" + pid + ")";
        }
    }

    pid = processList.add(process);
    
    console.log("process assigned id: " + pid);
    
    return process;
    
}
