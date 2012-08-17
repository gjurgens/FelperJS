module.exports = function() {
    function action(args) {
        console.log("Server");
    }
    return {
        "menu": {
            "commands": {
                "server": {
                    "description": "Server commands.",
                    "action": action
                }
            }
        }
    };
};