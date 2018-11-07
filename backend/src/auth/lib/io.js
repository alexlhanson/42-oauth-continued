import io from 'socket.io';

export default (http, subscribers) => {
  return io(http)
    .on('connection', socket => {
      console.log('connection receieved');

      Object.keys(subscribers).map(type => ({
        type, handler: subscribers[type]
      })).forEach(subscriber => {
        socket.on(subscriber.type, (payload) => {
          console.log('subscribe', subscriber.type, payload);

          try{
            subscriber.handler(socket)(payload);
          } catch (error){
            console.error('subscriber error', error);
          }
        })
      })
      .on('error', error => {
        console.error('socket error', error);
      })
      
};