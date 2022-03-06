import { Server, Socket } from "socket.io";

import { TicketControl } from "../../models";

const app = new TicketControl();

const ticketsSocketController = async (client : Socket, server : Server) => {
  // console.log('Client Connected (From Server)');
  console.log('entre tickets');

  client.on('disconnect', () => {
    // console.log('Client Disconnect (From Server)');
  })

  //----------------------- TICKET - SHARED -------------------------//
  client.emit('server-last-ticket', app.lastTicket);
  client.emit('server-queue-tickets', app.queueTickets.length);
  client.emit('server-screen-tickets', app.screenTickets);

  //----------------------- TICKET - TURN -------------------------//
  client.on('client-next-ticket', (_payload, _callback) => { //->Siempre que se ejecuta actualiza todos
    const ticketId = app.nextTicket();
    client.broadcast.emit('server-queue-tickets', app.queueTickets.length); //->Emite a todos menos al emisor
    server.emit('server-last-ticket', ticketId) //->Enviamos a demas pantallas y al emisor
    // callback(ticket); //-->Si enviamos el callback solo se actualiza la pantalla actual 
  });


  //----------------------- TICKET - DESKTOP -------------------------//
  client.on('client-desktop-ticket', (desktopId, callback) => { //->Actualiza solo al entrar
    const ticketId = app.desktopTickets[desktopId];
    client.emit('server-queue-tickets', app.queueTickets.length); //->Solo al emisor
    callback(ticketId) //-> No necesito que nadie mas vea esta actualizacion
    // server.emit('server-desktop-ticket', ticketId)
  })

  client.on('client-attend-ticket', (desktopId, callback) => {
    const ticket = app.attendTicket(parseInt(desktopId));
    server.emit('server-queue-tickets', app.queueTickets.length); //-> Actualiza la cola en todo (incluido)
    client.broadcast.emit('server-screen-tickets', app.screenTickets); //->Actualiza la pantalla
    callback(ticket?.id); //->Solo actualiza el ui del emisor
  })
}

export default ticketsSocketController;