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

  client.on('message-id', async ({id, ...payload}, callback) => {
    try {
      const message = new Message(payload);
      message.save().then(() => {
        callback(message.id);
      });
    } catch (error) {
      // console.log('There was and error while save the message');
    }
  });

  //-Cuando llega un mensaje del usuario conectado, se guarda en la db y se envia a el destinatario del mensaje
  client.on('chat-message', async (payload) => {
    try {
      Message.findByIdAndUpdate(payload.id, { $set: { tempUrl: payload.tempUrl }}).then(_ => {
        server.of('/mobile-chat').to(payload.to).emit('chat-message', JSON.stringify({message: payload}));
      });
    } catch (error) {
      // console.log('There was and error while save the message');
    }
  });

  client.on('message-read', (id) => {
    //-Probablemente con muchos mensajes sin leer se necesite un setInterval
    Message.findByIdAndUpdate(id, { read: true }).then(_ => {});
  });
}

export default socketMobileChatController;