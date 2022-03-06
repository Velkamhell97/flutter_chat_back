import { Server, Socket } from "socket.io";

const indexSocketController = async (client : Socket, server : Server) => {
  console.log('Client Connected (From Server)');

  client.on('disconnect', () => {
    console.log('Client Disconnect (From Server)');
  })

  // client.emit('welcome-message', {message: 'welcome'}); 
  // client.on('welcome-response', (payload) => console.log(payload.message)); 

  client.on('client-message', (payload, callback) => {
    // server.emit('server-response', payload); //->Todos los cliente incluyendo al que disparo este on
    client.broadcast.emit('server-response', payload) //->Todos los clientes excepto al que disparo el on

    const feedback = {id: 123456, date: new Date().getTime()}; //Simulacion de id generado por ese mensaje
    callback(feedback); //-Para disparar la retroalimentacion por parte del cliente, le pasa los argumentos esperados
  });
}

export default indexSocketController;