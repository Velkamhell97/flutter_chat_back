import { UserDocument } from "../interfaces/users";

interface IMessage {
  uid    : string,
  name   : string,
  message: string
}

class Message {
  public uid    : string;
  public name   : string;
  public message: string;

  constructor({uid, name, message}:IMessage){
    this.uid = uid;
    this.name = name;
    this.message = message;
  }

  // constructor(public uid: string, public name:string, public message:string){};
}

interface IUsers {
  [uid:string] : UserDocument
}

interface IRooms {
  [room:string] : Array<UserDocument>
}

interface IRooms2 {
  [room:string] : {
    [uid:string] : UserDocument
  }
}

class Chat {
  public messages: Array<Message>;
  public users: IUsers;
  public rooms: IRooms;

  constructor(){
    this.messages = [];
    //-Otra forma de almacenar valores en tipo de arreglos, la ventaja esque podemos obtener y eliminar los
    //-elementos de una manera mas rapido que si fuera un arreglo
    this.users = {}; 
    this.rooms = {};
  }

  get lastMessages():Array<Message> { 
    // return this.messages.slice(-10); //-Se deberian ir mostrando 10 a medida que sube el scroll
    return this.messages;
  }

  get usersList(): Array<UserDocument> {
    return Object.values(this.users);
  }

  roomUsers(room:string):Array<UserDocument>{
    return this.rooms[room];
  }

  sendMessage(data:IMessage): void {
    const message = new Message(data);
    this.messages.push(message);
  }

  addUser(user: UserDocument):void{
    this.users[user.id] = user;
  }

  addUserTo(room:string, user:UserDocument):void{
    this.rooms[room].push(user);
  }

  getUser(uid: string): UserDocument | undefined{
    return this.users[uid];
  }

  getRoomUsers(room:string): Array<UserDocument>{
    return [];
  }

  removeUser(uid:string):void{
    delete this.users[uid];
  }

  removeUserFrom(room: string, uid:string):void{
    this.rooms[room] = this.rooms[room].filter(user => user.id != uid);
  }
}

export default Chat;