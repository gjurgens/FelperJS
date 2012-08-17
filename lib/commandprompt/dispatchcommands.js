module.exports = function dispatchCommand(commandLine, menu) {
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
}
