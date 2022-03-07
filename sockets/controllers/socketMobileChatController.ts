import { Server, Socket } from "socket.io";

import { UserDocument } from "../../interfaces/users";
import { Message } from "../../models";

const socketMobileChatController = async (client : Socket, server : Server) => {
  // console.log('Client Connected (From Server)');
  const user: UserDocument = client.data.authUser;
  user.updateOne({online:true}).then(_ => server.of('/mobile-chat').emit('user-connect')); //-Al parecer toca ponerlo (en ausencia del await)

  client.on('disconnect', () => {
    user.updateOne({online:false}).then(_ => server.of('/mobile-chat').emit('user-disconnect'));
    // console.log('Client Disconnect (From Server)');
  });

  //-Una vez se conecta un usuario se le crea una sala personalizada con su ID
  client.join(user.id);

  //-Cuando llega un mensaje del usuario conectado, se guarda en la db y se envia a el destinatario del mensaje
  client.on('chat-message', async ({id, ...payload}) => {
    try {
      Message.create(payload).then(record => {
        server.of('/mobile-chat').to(payload.to).emit('chat-message', JSON.stringify({message: {id: record.id, ...payload}}));
      }); //-No se deja con el await para no detener el emit, pero puede fallar 
    } catch (error) {
      console.log('There was and error while save the message');
    }
  });

  client.on('message-read', (id) => {
    //-Probablemente con muchos mensajes sin leer se necesite un setInterval
    Message.findByIdAndUpdate(id, { read: true }).then(_ => {});
  });
}

export default socketMobileChatController;