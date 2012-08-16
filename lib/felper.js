(function() {    
    const DEFAULT_CONFIG_FILE = 'felper/config.js';
    
    var pkg = require('../package');
    var program = require('commander');
    var settings = new require('./settings')();
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
    
    function suggestCmd(commandLine, menu) {
        //Trim spaces
        var parts = commandLine.split(/ +/);
        var part;
        var currentMenuNode = menu.commands;
        var suggestions = [];
        
        //Complete parts
        for(part = 0; part < parts.length - 1 && currentMenuNode; part++) {
            if(currentMenuNode[parts[part]] && currentMenuNode[parts[part]].commands) {
                currentMenuNode = currentMenuNode[parts[part]].commands;
            } else {
                currentMenuNode = false;
            }
        }
        //Partial parts
        if(part === parts.length - 1 && currentMenuNode) {
            var pattern = new RegExp('^' + parts[part]);
            for(var name in currentMenuNode) {
                if(name.match(pattern)) {
                    suggestions.push(name);
                }
            }
        }
        if(suggestions.length > 0) {
            if(suggestions.length === 1) {
                var missing = suggestions[0].slice(parts[part].length,suggestions[0].length);
                missing += currentMenuNode[suggestions[0]].commands ? ' ' : '';
                return {"type":"single","missing":missing};
            } else {
                return {"type":"multiple","options":suggestions};
            }
        } else {
            return {"type":"null"};
        }
    }
    
    function prompt(menu) {
        const PROMPT_MESSAGE = 'felper> '
        var cmdBuffer = "", 
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
    			dispatchCommands(cmdBuffer, menu);
    		} else if (char == '\t') {
    		    var suggested = suggestCmd(cmdBuffer, menu);
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
    			    cmdBufferPos = cmdBuffer.length;
    				process.stdout.write('\nup\nfelper> ' + cmdBuffer);
    			}
                if(char.charCodeAt(2) === 66){
                    cmdBufferPos = cmdBuffer.length;
                    process.stdout.write('\ndown\nfelper> ' + cmdBuffer);
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
    
    function dispatchCommands(commandLine, menu) {
        //Trim spaces
        commandLine = commandLine.replace(/^\s+|\s+$/g, '');
        
        var parts = commandLine.split(/ +/),
            part = 0,
            currentPart = "",
            currentMenu = menu,
            hasParams = false,
            params = "";
        
        for(part = 0; part < parts.length; part++) {
            currentPart = parts[part];
            if(currentMenu.commands && currentMenu.commands[currentPart]) {
                currentMenu = currentMenu.commands[currentPart];
            } else {
                hasParams = currentPart.length > 0;
                break;
            }
        }

        if(hasParams) {
            params = parts.slice(part,parts.length).toString().replace(/\,/g," ");
        }

        if(typeof currentMenu.action  === "function") {
            currentMenu.action(params);
        } else if(commandLine.length > 0) {
            console.log('Command "' + commandLine +'" not found.');
        }

        prompt(menu);
    }
    prompt(menu);
    
})();
