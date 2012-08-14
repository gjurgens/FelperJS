(function() {    
    var pkg = require('../package');
    var program = require('commander');
    
    program.version(pkg.version?pkg.version:"undefined")
    .option('-c, --configfile <file>', 'Configuration file');
    

    program.command('run [configFile]')
        .description('Run felper from configuration file')
        .action(function(configFile) {
            console.log('Run using %s config file.', configFile);
        });    

    program.parse(process.argv);
    
    if (program.configfile)
        console.log('configfile: ' + program.configfile);
    
    var prompt = function() {
        program.prompt('felper: ', dispatchCommands);
    };
    
    function dispatchCommands(commandLine) {
        var args = commandLine.split(/ +/);
        var command = args.shift().toLowerCase();

        switch(command) {
            case "exit":
            case "quit":
            case "bye":
                //EXIT handler
                console.log('saliendo');
                process.exit(code=0);
                break;
            default:
                //TODO: Handle of non existing commands
                if(command) {
                    try{
                        require("./commands/" + command)(args);
                    } catch(err) {
                        console.log('ERROR: Command "%s" not found', command);
                        console.log(program.helpInformation());
                    }
                }
        }

        prompt();
    }
    prompt();
    
})();
