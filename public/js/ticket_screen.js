const lblTicket1  = document.querySelector('#lblTicket1');
const lblDesktop1 = document.querySelector('#lblEscritorio1');

const lblTicket2  = document.querySelector('#lblTicket2');
const lblDesktop2 = document.querySelector('#lblEscritorio2');

const lblTicket3  = document.querySelector('#lblTicket3');
const lblDesktop3 = document.querySelector('#lblEscritorio3');

const lblTicket4  = document.querySelector('#lblTicket4');
const lblDesktop4 = document.querySelector('#lblEscritorio4');

const lbls = [
  {
    ticket: lblTicket1,
    desktop: lblDesktop1
  },
  {
    ticket: lblTicket2,
    desktop: lblDesktop2
  },
  {
    ticket: lblTicket3,
    desktop: lblDesktop3
  },
  {
    ticket: lblTicket4,
    desktop: lblDesktop4
  },
]

const socket = io('/tickets');

socket.on('connect', () => {
  
});

socket.on('disconnect', () => {

});

socket.on('server-screen-tickets', (screenTickets) => {
  const audio = new Audio('../audio/new-ticket.mp3');
  audio.play();

  for (let index = 0; index < lbls.length; index++) {
    const ticket = lbls[index];

    ticket.ticket.innerText = 'Ticket ' + screenTickets[index].id;
    ticket.desktop.innerText = 'Escritorio ' + screenTickets[index].desktop;
  }
});