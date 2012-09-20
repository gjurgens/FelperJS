module.exports = function ProcessList(processList) {
    var processList = [];
    
    return {
        add: function(process) {
            processList.push(process);
            return processList.length - 1;
        },
        getProcess: function(pid) {
            return processList[pid];
        },
        remove: function(pid) {
            processList[pid] = null;
        },
        list: function() {
            for(var i = 0; i < processList.length; i++) {
                if(processList[i]) console.log(processList[i].toString());
            }
        }
    }
};
