module.exports = function(commandPrompt) {
    return {
        asyncWrite:function(msg) {
            process.stdout.write('\n\r' + msg + '\n\r' + commandPrompt.getPromptMessage() + commandPrompt.getCommandBuffer());
        }
    }
}