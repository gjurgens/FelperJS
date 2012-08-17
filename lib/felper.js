(function() {    
    const DEFAULT_CONFIG_FILE = 'felper/config.js';
    
    var pkg = require('../package');
    var program = require('commander');
    var settings = new require('./settings')();
    //var commandHistory = new require('./commandprompt/commandhistory')();
    var commandPrompt = new require('./commandprompt/commandprompt')();
    var fs = require('fs');
    
    var menu = {
        "commands": {
            "exit": {
                "description": "Exit felper prompt.",
                "action": function() {
                    console.log('Goodbye.');
                    process.exit(0);   			
                }
            },
            "settings": {
                "description": "Display settings",
                "action": function() {
                    settings.display();
                },
                "commands":{
                    "save": {
                        "description": "Save settings.",
                        "action": function(args) {
                            settings.save(args);
                        }
                    },
                    "display": {
                        "description": "Display settings.",
                        "action": function() {
                            settings.display();            
                        }
                    },
                    "set": {
                        "description": "Set settings.",
                        "action": function(args) {
                            settings.set(args);
                        }
                    }
                }
            }
        }
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
    commandPrompt.get(menu);
    
})();
