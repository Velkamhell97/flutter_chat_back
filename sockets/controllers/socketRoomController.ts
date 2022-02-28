import { Server, Socket } from "socket.io";

import Room from "../../models/room";
import { UserDocument } from "../../interfaces/users";

const rooms = new Room();

const socketRoomController = async (client : Socket, server : Server) => {
  // console.log('Client Connected (From Server)');

  client.on('disconnect', () => {
    // console.log('Client Disconnect (From Server)');
  })

  //----------------------- SERVER - CONNECT -------------------------//
  const user: UserDocument = client.data.authUser;
  client.emit('user-auth', {authUser:user, newToken: client.data.newToken}) //-Usuario autenticado - solo el que se conecta

  //----------------------- CHAT - ROOM -------------------------//
  client.on('user-room-connect', (room) => {
    const chat = rooms.getChat(room); 

    if(chat.users[user.id]){
      client.data.same = true; //-Cuando el mismo usuario se conecta de otro lado
    } else {
      chat.addUser(user); //-Solo lo agrega si no existe
    }

    client.join(room);
    client.data.room = room; //-No se envia el chat para no cargar de info

    client.emit('incoming-room-message', {messages: chat.lastMessages, uid: user.id}); //-Carga los mensajes

    server.of('/rooms').to(room).emit('users-room-changes', chat.usersList); //-Actualiza los usuarios
    client.to(room).emit('user-room-connect', user.name);//-Notifica al resto que se conecto
  });

  client.on('disconnect', () => {
    const room = client.data.room;
    const chat = rooms.getChat(room);

    //-Si el cliente es el mismo no lo elimine ni lo saque de la sala
    if(!client.data.same){
      chat.removeUser(user.id);
      client.leave(room);
    }

    server.of('/rooms').to(room).emit('users-room-changes', chat.usersList);
    client.to(room).emit('user-room-disconnect', user.name);

    // if(!chat.usersList.length){ //-Elimina la sala y todos los mensajes (opcional)
    //   rooms.deleteRoom(room);
    // }
  });

  client.on('outcoming-room-message', ({room, message}) => {
    const chat = rooms.getChat(room); //-No se crea un objeto global sino que cada instancia obtiene su chat
    chat.sendMessage({uid: user.id, name: user.name, message});

    server.of('/rooms').to(room).emit('incoming-room-message', {messages: chat.lastMessages, uid:user.id});
  })
}

export default socketRoomController;