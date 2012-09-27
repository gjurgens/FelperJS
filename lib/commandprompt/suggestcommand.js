module.exports = function suggestCommand(commandLine, menu) {
    //Trim spaces
    var parts = commandLine.split(/ +/);
    var part;
    var currentMenuNode = menu.commands;
    var suggestions = [];
    var params = [];
    var helpMsg = "";
    
    //Complete parts
    for(part = 0; part < parts.length - 1 && currentMenuNode; part++) {
        if(currentMenuNode[parts[part]] && currentMenuNode[parts[part]].commands) {
            currentMenuNode = currentMenuNode[parts[part]].commands;
        } else {
            if(currentMenuNode[parts[part]] && currentMenuNode[parts[part]].params) {
                var paramsDescriptions = "\nPARAMS:\n"
                //suggestions.push("parametro");
                helpMsg += "\nSYNTAX:\n";
                helpMsg += parts.slice(0,part + 1).toString().replace(/\,/g," ");
                for(var param in currentMenuNode[parts[part]].params) {
                    helpMsg += " ";
                    helpMsg += currentMenuNode[parts[part]].params[param].required ? "<" : "[";
                    helpMsg += currentMenuNode[parts[part]].params[param].name;
                    helpMsg += currentMenuNode[parts[part]].params[param].required ? ">" : "]";
                    
                    paramsDescriptions += currentMenuNode[parts[part]].params[param].name + ": " + currentMenuNode[parts[part]].params[param].description + "\n"; 
                    
                    params.push(currentMenuNode[parts[part]].params[param].name);
                }
                helpMsg += "\n\nDESCRIPTION:\n" + currentMenuNode[parts[part]].description;
                helpMsg += "\n" + paramsDescriptions;
            }
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
        if(params.length > 0) {
            return {"type":"param","params":params,"helpMsg":helpMsg};
        } else {
            return {"type":"null"};            
        }
    }
}

