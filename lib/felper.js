(function() {    
    const DEFAULT_CONFIG_FILE = './config.js';
    
    var pkg = require('../package');
    var program = require('commander');
    var settings = new require('./settings')();
    var fs = require('fs');
    
    var menu = {
    	"exit": {
    		"description": "Exit felper prompt.",
    		"action": function() {
                console.log('Goodbye.');
                process.exit(0);   			
    		}
    	},
    	"settings": {
    		"description": "Exit felper prompt.",
    		"action": function() {
                console.log('Goodbye.');
                process.exit(0);   			
    		}
    	}
    }
    
    
    function prompt() {
    	var cmdBuffer = "";
    	
    	process.stdout.write('felper> ');
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
    				process.stdout.write('\b \b');    				
    			}
    		} else if (char == '\r') {
    			process.stdin.pause();
    			process.stdin.removeAllListeners('data');
    			process.stdout.write('\n\r');
    			dispatchCommands(cmdBuffer);
    		} else if (char == '\t') {
    			process.stdout.write('\nsugested\nfelper> ' + cmdBuffer);
    		} else if (char.charCodeAt(0) === 27 && char.charCodeAt(1) === 91) {
    			if(char.charCodeAt(2) === 65){
    				process.stdout.write('\nup\nfelper> ' + cmdBuffer);
    			}
    			if(char.charCodeAt(2) === 66){
    				process.stdout.write('\ndown\nfelper> ' + cmdBuffer);
    			}
    			
    		} else {
    			cmdBuffer += char;
    			process.stdout.write(char);
    		}
    	});
    }
    
    
    program.version(pkg.version?pkg.version:"undefined")
        .option('-c, --configfile <file>', 'Configuration file');
    

    program.command('run [configFile]')
        .description('Run felper from configuration file')
        .action(function(configFile) {
            console.log('Run using %s config file.', configFile);
        });    

    program.parse(process.argv);
    
    //Load config file
    if (program.configfile) {
        settings.loadFromFile(program.configfile);
    } else {
        if(fs.existsSync(DEFAULT_CONFIG_FILE)) {
            console.log('Loading default config file: ' + DEFAULT_CONFIG_FILE);
            try{
                settings.loadFromFile(DEFAULT_CONFIG_FILE);
                console.log('Default config file loaded.');
            } catch(err) {
                console.log('Error loading default config file: ' + DEFAULT_CONFIG_FILE);
            }
        } else {
            console.log('Default config file "' + DEFAULT_CONFIG_FILE + '" not found.')
        }
    }
    
    var cmdLine = function() {
        program.prompt('felper> ', function(commandLine) {
            dispatchCommands(commandLine);
        });
        
    };
    
    function dispatchCommands(commandLine) {
        var args = commandLine.split(/ +/);
        var command = args.shift().toLowerCase();

        switch(command) {
            case "exit":
            case "quit":
            case "bye":
                //EXIT handler
                console.log('Goodbye.');
                process.exit(0);
                break;
            case "settings":
                if(args.length > 0) {
                    command = args.shift().toLowerCase();
                    args = args.toString().replace(","," ");
                    switch(command) {
                        case "display":
                        case "show":
                            settings.display();
                            break;
                        case "set":
                            settings.set(args);
                            break;
                        case "save":
                            settings.save(args);
                            break;
                        default:
                        	console.log('Command "' + command + '" not found.');
                    }
                } else {
                    settings.display();
                }
                break;
            default:
                //TODO: Handle of non existing commands
                if(command) {
                    var fs = require('fs');
                    var commandPath = "./commands/" + command;
                    if(fs.existsSync('./lib/' + commandPath + '.js')) {
                        require(commandPath)(args);
                    }
                    else {
                        console.log('ERROR: Command "%s" not found', command);
                        console.log(program.helpInformation());
                    }
                }
        }

        //cmdLine();
        prompt();
    }
    //cmdLine();
    prompt();
    
})();
