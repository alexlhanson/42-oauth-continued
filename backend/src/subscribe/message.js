const message = socket => payload => {
  socket.broadcast.emit('MESSAGE', {...payload, username: socket.username});
};

export default message;