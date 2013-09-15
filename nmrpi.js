var ss = require('socket.io-stream')
  , path = require('path')
  , fs = require('fs')
  , brain = require('./brain.js');



var start = function (config) {
  var io = require('socket.io').listen(config.port);

  io.sockets.on('connection', function (socket) {

    ss(socket).on('addController', function(stream, data) {
      var filename = path.basename(data.name);
      
      stream.on('end', function (){
        brain.addController(config.folderPath + '/' + filename);
      });

      stream.pipe(fs.createWriteStream(config.folderPath + '/' + filename), function (err, result) {
        if (err) {console.log(err);}
      });

    });


    socket.on('execute', function(options) {
      brain.execute(options.controllerID, options.command);
    });


    socket.on('disconnect', function(){
      console.log('Socket disconnect');
    });
  });

};


module.exports = {
  start: start,
};
