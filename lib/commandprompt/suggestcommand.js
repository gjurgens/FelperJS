module.exports = function suggestCommand(commandLine, menu) {
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

