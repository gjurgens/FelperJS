module.exports = function Process(processList, handler) {
    console.log("process constructor");
        
    var pid = null;
    var started = false;
    
    
    var process = {
        start: function() {
            console.log("start: " + pid);
            started = true;            
        },
        stop: function() {
            console.log("stop: " + pid);
            started = false
        },
        isStarted: function() {
            return started;
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
