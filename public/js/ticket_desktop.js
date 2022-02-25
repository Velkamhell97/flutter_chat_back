const lblDesktop = document.querySelector('#lblAtenderTicket');
const btnDesktop = document.querySelector('#btnAtenderTicket');

const lblAlert   = document.querySelector('#lblAlertaTickets');
const lblTicket  = document.querySelector('#lblColaTickets');

const socket = io();

const params = Object.fromEntries(new URLSearchParams(window.location.search));

if(!params.desktop){
  window.location = 'ticket-home.html';
  throw new Error('The desktop is required');
}

socket.on('connect', () => {
  btnDesktop.disabled = false;
  socket.emit('client-desktop-ticket', params.desktop, (ticketId) => {
    lblDesktop.innerText = ticketId ? `Ticket ${ticketId}` : '...' 
  }) 
})

socket.on('disconnect', () => {
  btnDesktop.disabled = true;
})

socket.on('server-queue-tickets', (queueTickets) => {
  lblTicket.innerText = queueTickets;
  if(queueTickets == 0) {
    lblAlert.innerText = 'No hay mas tickets';
    btnDesktop.disabled = true;
  } else {
    lblAlert.innerText = 'Tickets en la cola';
    btnDesktop.disabled = false;
  }
})

btnDesktop.addEventListener('click', () => {
  socket.emit('client-attend-ticket', params.desktop, (ticketId) => {
    lblDesktop.innerText = ticketId ? `Ticket ${ticketId}` : '...' 
  });
})