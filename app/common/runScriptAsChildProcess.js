var childProcess = require('child_process')
var fs = require('fs')
var path = require('path')

module.exports.run = function(scriptPath, cb) {
    let scriptExists = true;

    if(fs.exists(scriptPath, (exists) => {
        throw new Error("File " + scriptPath + " doesn't exists");
    }));

    var process = childProcess.fork(scriptPath);

    process.on('error', (err) => {
        cb(err);
    });

    process.on('exit', (code) => {
        let err = null;
        err = code === 0 ? null : Error('script ' + path.basename(scriptPath) + " receive code " + code)

        cb(err)
    })
}