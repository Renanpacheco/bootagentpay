const io = require('socket.io')(3000)

io.on('connection', socket => {
    console.log('New WebSocket connection')
    
    socket.emit('chatMessage', 'Welcome to the chat!')
})