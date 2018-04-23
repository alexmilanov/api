var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var config = require('./app/config'); // get our config file
var apiRoutes = require('./app/middlewares/routes')
var cluster = require('cluster')

var port = config.port;
var numberOfWorkers = require('os').cpus().length;

mongoose.connect(config.database);

if(cluster.isMaster) {
    console.log("Master process has been started. Total number of workers: " + numberOfWorkers);
    for(let i = 0; i < numberOfWorkers; i++) {
        cluster.fork();

    }

    cluster.on('online', function(worker){
        console.log("\t Worker " + worker.process.pid + " is started");
    });

    cluster.on('exit', function(worker, code, signal){
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
}
else {
    app.set('secret', config.secret);

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    
    app.use(morgan('dev'));
    
    app.use('/api', apiRoutes)
    
    app.listen(port);
}


