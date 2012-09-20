module.exports = function() {
    var prompt = new require('./commandprompt/commandprompt')().getPromptMessage;
    return {
        write:function(msg) {
            console.log('\n' + msg + '\n' + prompt);
        }
    }
}