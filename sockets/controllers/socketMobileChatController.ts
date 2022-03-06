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
  client.on('chat-message', async (payload) => {
    try {
      Message.create(payload).then(_ => {}); //-No se deja con el await para no detener el emit, pero puede fallar 
      server.of('/mobile-chat').to(payload.to).emit('chat-message', JSON.stringify({message: payload}));
    } catch (error) {
      console.log('There was and error while save the message');
    }
  });

  //----------------------- SERVER - CONNECT -------------------------//
  // client.emit('incoming-message', {messages: chat.lastMessages, uid: user.id}); //-Solo el cliente actualiza su lista de usuarios

  // server.of('/mobile-chat').emit('users-changes', chat.usersList); //-Todos actualizan la lista de usuarios

  // //----------------------- CHAT - GLOBAL -------------------------//
  // client.on('disconnect', () => {
  //   chat.removeUser(user.id); 
  //   server.of('/mobile-chat').emit('users-changes', chat.usersList);
  // });

  // client.on('outcoming-message', ({uid, message}) => {
  //   chat.sendMessage({uid: user.id, name: user.name, message});
  //   server.of('/mobile-chat').emit('incoming-message', {messages: chat.lastMessages, uid: user.id});
  // })
}

export default socketMobileChatController;