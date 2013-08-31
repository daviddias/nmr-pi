var io = require('socket.io').listen(8080)
  , inspect = require('util').inspect
  , ss = require('socket.io-stream')
  , path = require('path')
  , fs = require('fs')
  , controlCenter = require('./controlCenter')

io.sockets.on('connection', function (socket) {
  ss(socket).on('addController', function(stream, data) {
    // 1. Add the controler file.js to the folder
    var filename = path.basename(data.name)
    stream.on('end', function (){
      controlCenter.addController("./receivedControllers/" + filename)
    })
    stream.pipe(fs.createWriteStream("./receivedControllers/" + filename), function (err, result) {}) 
  })

  socket.on('execute', function(options) {
    controlCenter.execute(options.controllerID, options.command)
  })

  socket.on('disconnect', function(){
    console.log("Socket disconnect")
  })
})
