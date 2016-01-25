// app-server.js
import express from 'express'
const app = express()
// Set port
app.set('port', process.env.PORT || 3000)
// Static files
app.use(express.static('public'))
import config from './config'
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Models
import Message from './models/Message'

// Listen for a connection
io.on('connection', function(socket){
  // Create message
  socket.on('chat message', function(params){
    Message.create(config, params, (message) => {
      io.emit('chat message', message);
    })
  })
})

// Route
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html')
})

http.listen(app.get('port'), function(){
  console.log('React Chat App listening on ' + app.get('port'))
})