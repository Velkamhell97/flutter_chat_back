import { Server, Socket } from "socket.io";

import { UserDocument } from "../../interfaces/users";
import { Chat } from "../../models";

const chat = new Chat();

const socketChatController = async (client : Socket, server : Server) => {
  // console.log('Client Connected (From Server)');
  
  client.on('disconnect', () => {
    // console.log('Client Disconnect (From Server)');
  })

  //----------------------- SERVER - CONNECT -------------------------//
  const user: UserDocument = client.data.authUser;
  chat.addUser(user);
  
  client.emit('user-auth', {authUser:user, newToken: client.data.newToken}) //-Usuario autenticado - solo el que se conecta
  client.emit('incoming-message', {messages: chat.lastMessages, uid: user.id}); //-Solo el cliente actualiza su lista de usuarios

  server.of('/chat').emit('users-changes', chat.usersList); //-Todos actualizan la lista de usuarios
  client.broadcast.emit('user-connect', user.name); //-Todos menos el cliente saben que el se conecto

  //----------------------- CHAT - PRIVATE -------------------------//
  //-El usuario se conecta a una sala, ahora tendra: la global, la del socket id y la del user id
  // client.join(user.id);

  //----------------------- CHAT - GLOBAL -------------------------//
  client.on('disconnect', () => {
    chat.removeUser(user.id); 
    server.of('/chat').emit('users-changes', chat.usersList);
    client.broadcast.emit('user-disconnect', user.name);
  });

  client.on('outcoming-message', ({uid, message}) => {
    if(uid){
      server.of('/chat').to(uid).emit('incoming-private-message', {de: user.name, message});
    } else {
      chat.sendMessage({uid: user.id, name: user.name, message});
      server.of('/chat').emit('incoming-message', {messages: chat.lastMessages, uid: user.id});
    }
  })
}

export default socketChatController;