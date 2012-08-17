module.exports = function () {
    function clearBuffer() {
        for(var i = 0; i < cmdBuffer.length; i++) {
            process.stdout.write('\b \b');
        }
        cmdBufferPos = 0;
    }
    
    function history(direction,commandHistory) {
        var history = "";
        if(direction === -1 ) history = commandHistory.getPrev();
        if(direction === 1 ) history = commandHistory.getNext();
        cmdBuffer = history;
        cmdBufferPos = cmdBuffer.length;
        process.stdout.write(cmdBuffer);            
    }
    
    function get(menu) {
        cmdBuffer = "";
        cmdBufferPos = 0;

        process.stdout.write(PROMPT_MESSAGE);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.setRawMode(true);
        process.stdin.on('data', function(char) {
            if (char == '\3') {
                console.log('\nExiting on Ctrl-C...');
                process.exit();
            } else if (char.charCodeAt(0) === 127) {
                if(cmdBuffer.length > 0){
                    cmdBuffer = cmdBuffer.slice(0,cmdBuffer.length - 1);
                    cmdBufferPos--;
                    process.stdout.write('\b \b');                  
                }
            } else if (char == '\r') {
                process.stdin.pause();
                process.stdin.removeAllListeners('data');
                process.stdout.write('\n\r');
                commandHistory.add(cmdBuffer);
                commandHistory.clearTyped();
                dispatchCommands(cmdBuffer, menu);
                get(menu, commandHistory);
            } else if (char == '\t') {
                var suggested = suggestCommand(cmdBuffer, menu);
                switch(suggested.type) {
                case "single":
                    cmdBuffer += suggested.missing;
                    cmdBufferPos = cmdBuffer.length;
                    process.stdout.write(suggested.missing);
                    break;
                case "multiple":
                    process.stdout.write('\n\r' + suggested.options + '\n\r' + PROMPT_MESSAGE + cmdBuffer);
                    break;
                case "null":
                    break;
                }
            } else if (
                    //Arrow Keys
                    char.charCodeAt(0) === 27 && 
                    char.charCodeAt(1) === 91 &&
                    char.charCodeAt(2) >= 65 &&
                    char.charCodeAt(2) <= 68
            ) {
                if(char.charCodeAt(2) === 65){
                    commandHistory.saveTyped(cmdBuffer);
                    clearBuffer();
                    history(-1,commandHistory);
                }
                if(char.charCodeAt(2) === 66){
                    clearBuffer();
                    history(1,commandHistory);
                }
                /* Left and right arrow key disabled
                if(char.charCodeAt(2) === 67){
                    if(cmdBufferPos < cmdBuffer.length){
                        cmdBufferPos++;
                        process.stdout.write(char);
                    }
                }
                if(char.charCodeAt(2) === 68){
                    if(cmdBufferPos > 0){
                        cmdBufferPos--;
                        process.stdout.write(char);
                    }
                }
                 */
            } else {
                cmdBuffer += char;
                cmdBufferPos++;
                process.stdout.write(char);
            }
        });
    };
    
    const PROMPT_MESSAGE = 'felper> '
    var cmdBuffer = "", 
        cmdBufferPos = 0;
    
    var dispatchCommands = require('./dispatchcommands')
    var suggestCommand = require('./suggestcommand')
    var commandHistory = new require('./commandhistory')();
    
    return {
        "get": get
    }
};
