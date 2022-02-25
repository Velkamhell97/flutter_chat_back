import path from 'path';
import fs from 'fs';

import data from '../data/ticket_data.json';

interface ITicket {
  id: number,
  desktop ?: number
}

class Ticket {
  public id : number;
  public desktop ?: number;

  constructor({ id, desktop } : ITicket) {
    this.id = id,
    this.desktop = desktop
  }
}

class TicketControl {
  public lastTicket     : number;
  private today         : number;
  public queueTickets   : Array<Ticket>;
  public screenTickets  : Array<Ticket>;
  public desktopTickets : any;
 
  constructor(){  
    this.lastTicket     = 0;
    this.today          = new Date().getDate()
    this.queueTickets   = [];
    this.screenTickets  = [];
    this.desktopTickets = {};

    this.init();
  }

  init(){
    const { lastTicket, today, queueTickets, screenTickets, desktopTickets } = data;
    if(today === this.today){
      this.lastTicket     = lastTicket;
      this.queueTickets   = queueTickets.map(ticket => new Ticket(ticket as ITicket));
      this.screenTickets  = screenTickets.map(ticket => new Ticket(ticket as ITicket));
      this.desktopTickets = desktopTickets
    } else {
      this.saveDB()
    }
  }

  saveDB(){
    const pathDB = path.join(__dirname, '../../data/ticket_data.json');
    fs.writeFileSync(pathDB, JSON.stringify(this));
  }

  nextTicket(): number{
    this.lastTicket += 1;
    this.queueTickets.push(new Ticket({id: this.lastTicket}));
    this.saveDB();
 
    return this.lastTicket;
  }

  attendTicket(desktop : number) : Ticket | undefined {
    if(!this.queueTickets.length){
      return;
    }

    const ticket = this.queueTickets.shift()!; 
    ticket.desktop = desktop;

    //-Para que no hayan escritorios repetidos en la pantalla
    if(this.desktopTickets[desktop]){
      //-Si un escritorio con turno va a tomar otro se busca el indice en los 4 y se elimina, corriendo el arreglo
      //-hacia arriba, luego est nuevo turno se agrega al inicio
      const index = this.screenTickets.findIndex(ticket => ticket.desktop == desktop);
      this.screenTickets.splice(index, 1);

      // this.last4 = this.last4.filter(ticket => ticket.desktop != ticket.desktop); //forma 2
    }

    this.desktopTickets[desktop] = ticket.id;
    this.screenTickets.unshift(ticket);

    if(this.screenTickets.length > 4){
      this.screenTickets.pop();
    }

    this.saveDB();

    return ticket;
  }
}

export default TicketControl;