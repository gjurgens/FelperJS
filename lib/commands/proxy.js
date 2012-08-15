module.exports = function(args) {
    var program = require('commander');
    program.parse(process.argv);
    console.log('PROXY: ' + args);
};
