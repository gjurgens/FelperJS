module.exports = function Settings() {
    var fs = require('fs');
    //Private properties
    var data = {};
    var configFile = false;
    
    function validate(settings) {
        //TODO: validate settings
        if(typeof settings === "object"){
            return true;
        } else {
            error("Invalid settings: " + settings);
            return false;
        }
    } 
    
    function error(msg) {
        console.log(msg);
        //process.exit(1);
    }
    
    function formatedSettings() {
        return JSON.stringify(data,null,3);
    }
    
    return {
        "data": data,
        "get": function() {
            return JSON.parse(JSON.stringify(data));
        },
        "set": function(value) {
            if (typeof value === "string") {
                value = JSON.parse(value);
            }
            if(validate(value)) data = value;
        },
        "loadFromFile": function(file) {
            if(fs.existsSync(file)) {
                configFile = file;
                var settings = fs.readFileSync(file,'utf8');
                if(settings) {
                    try{
                        settings = JSON.parse(settings);
                        if(validate(settings)) data = settings;
                    } catch (err) {
                        error('Invalid JSON format in ' + file);
                    }
                }
            } else {
                error('Config file "' + file + '" not found.')                    
            }
        },
        "save": function(file) {
        	file=file?file:configFile;
            if(file) {
            	if(fs.existsSync(file)) {
            		console.log('Overwrite "' + file + '"?');
            	} else {
            		fs.writeFileSync(file,formatedSettings());
            	}
            } else {
            	error('No settings file was specified.');
            }
        },
        "display": function() {
            console.log(formatedSettings());
        }
    }
}

