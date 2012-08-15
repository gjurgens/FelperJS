(function() {    
    const DEFAULT_CONFIG_FILE = './config.js';
    
    var pkg = require('../package');
    var program = require('commander');
    var settings = new require('./settings')();
    var fs = require('fs');
    
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
    
    var prompt = function() {
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

        prompt();
    }
    prompt();
    
})();
