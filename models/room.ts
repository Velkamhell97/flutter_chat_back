import { Chat } from ".";

interface IRooms {
  [uid:string] : Chat 
}

class Room {
  public chats : IRooms;

  constructor(){
    this.chats = {};
  }
  
  get roomsList(): Array<string> {
    return Object.keys(this.chats);
  }

  get chatsList(): Array<Chat> {
    return Object.values(this.chats);
  }

  getChat(room:string):Chat{
    if(Object.keys(this.chats).includes(room)){
      return this.chats[room];
    } else {
      return this.createRoom(room);
    }
  }

  createRoom(room:string): Chat{
    this.chats[room] = new Chat();
    return this.chats[room];
  }

  deleteRoom(room:string){
    delete this.chats[room];
  }
}

export default Room;