// app-server.js
import express from 'express'
const app = express()
// Set port
app.set('port', process.env.PORT || 3000)
// Static files
app.use(express.static('public'))
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Config
import config from './config'

// Models
import Message from './models/Message'

// Listen for a connection
io.on('connection', socket => {
  // Create message
  socket.on('chat message', params => {
    Message.create(config, params, (message) => {
      io.emit('chat message', message);
    })
  })
})

// Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

http.listen(app.get('port'), () => {
  console.log('React Chat App listening on ' + app.get('port'))
})