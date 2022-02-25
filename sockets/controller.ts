import { Server, Socket } from "socket.io";

const socketController = async (client : Socket, server : Server) => {
  console.log('Client Connected (From Server)');

  client.on('disconnect', () => {
    console.log('Client Disconnect (From Server)');
  })

  client.on('client-message', (payload, callback) => {
    // console.log(payload);
    // server.emit('server-response', payload); //-Todos los cliente conectados incluyendo al que disparo este on
    client.broadcast.emit('server-response', payload) //-Todos los clientes conectados excepto al que disparo el on

    const feedback = {id: 123456, date: new Date().getTime()}; //Simulacion de id generado por ese mensaje
    callback(feedback); //-Para disparar la retroalimentacion por parte del cliente, le pasa los argumentos esperados
  });
}

export default socketController;