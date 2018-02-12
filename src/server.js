const http = require('http');
const app = require('express')();

// Allows for path resolution, which is required by express
const path = require('path');

const server = http.Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || process.env.NODE_PORT || 3000;

server.listen(port);

app.get('/*', (req, res) => {
  if (req.originalUrl === '/') {
    res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
  } else if (req.originalUrl === '/Doge.jpg') {
    res.sendFile(path.resolve(`${__dirname}/../client${req.originalUrl}`));
  } else {
    res.status(404).send('Not Found');
  }
});

const doges = {};

const onSendDoge = (socket) => {
  socket.on('sendDoge', (data) => {
    doges[socket.id] = data;
    io.sockets.in('room1').emit('sendDoge', data);
  });
};

io.on('connection', (socket) => {
  socket.join('room1');
  onSendDoge(socket);

  const dogeKeys = Object.keys(doges);
  for (let i = 0; i < dogeKeys.length; i++) {
    socket.emit('sendDoge', doges[dogeKeys[i]]);
  }
});
