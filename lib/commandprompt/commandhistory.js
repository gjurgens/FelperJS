module.exports = function CommandHistory() {
    var commands = [],
        pos = 0,
        typed = "";
    return {
        "add": function(command) {
            commands.push(command);
            pos = commands.length;
        },
        "getPrev": function() {
            if(pos > 0) pos--;
            if(commands[pos]){
                return commands[pos];
            } else {
                return "";
            }
        },
        "getNext": function() {
            if(pos < commands.length) pos++;
            if(pos === commands.length) {
                return typed;
            } else {
                return commands[pos];
            }
        },
        "saveTyped": function(command) {
            if(pos === commands.length) {
                typed = command;
            }
        },
        "clearTyped": function() {
            typed = "";
        }
    }
}
