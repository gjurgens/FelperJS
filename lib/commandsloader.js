module.exports = function() {
    var fs = require('fs');

    const COMMAND_DIRECTORY = __dirname + '/commands/';
    
    var commandFiles = fs.readdirSync(COMMAND_DIRECTORY);
    
    console.log('Loading commands from: ' + COMMAND_DIRECTORY)
    for(var i = 0; i < commandFiles.length; i++) {
        console.log('\t' + commandFiles[i]);
        //console.log('Loading' + COMMAND_DIRECTORY + commandFiles[i]);
    }
    console.log('\tOK\n\r');
};
