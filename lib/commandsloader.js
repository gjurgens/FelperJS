module.exports = function(menu, settings, processList) {
	const COMMAND_DIRECTORY = __dirname + '/commands/';
	
    var fs = require('fs');

    function getMenuNode(menu, commandMenu) {
		for(var command in commandMenu.commands) {
			if(!menu.commands) menu.commands = {};
			if(!menu.commands[command]) {
				menu.commands[command] = commandMenu.commands[command];
			} else {
				getMenuNode(menu.commands[command],commandMenu.commands[command]);
			}
		}
    }
    
    var commandFiles = fs.readdirSync(COMMAND_DIRECTORY);
    var command;
    
    console.log('Loading commands from: ' + COMMAND_DIRECTORY)
    for(var i = 0; i < commandFiles.length; i++) {
        console.log('\t' + commandFiles[i]);
        //console.log('Loading' + COMMAND_DIRECTORY + commandFiles[i]);
        command = new require(COMMAND_DIRECTORY + commandFiles[i])(settings, processList);
        if(!(settings.get().commands instanceof Array)) {
            settings.extend({"commands":[]});
        }
        
        /*
        if(!(settings.get().commands[command.processType] instanceof Array)) {
            settings.commands[command.processType] = [];
        }
        */
        
        if(typeof command.loadSettings === "function") {
            command.loadSettings();
        }
        getMenuNode(menu, command.menu);
    }
    console.log('\tOK\n\r');
};
