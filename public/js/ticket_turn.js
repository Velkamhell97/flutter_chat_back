const lblTicket = document.querySelector('#lblNuevoTicket');
const btnTicket = document.querySelector('#btnNuevoTicket');

//-Esto se ejecuta cuando se entra a la pagina
const socket = io('/tickets');

socket.on('connect', () => {
  btnTicket.disabled = false;
})

socket.on('disconnect', () => {
  btnTicket.disabled = true;
})

//-Asi el servidor corra primero, apenas la pagina cargue escuchara este evento 
socket.on('server-last-ticket', (ticketId) => {
  lblTicket.innerText = 'Ticket ' + ticketId;
})

btnTicket.addEventListener('click', () => {
  socket.emit('client-next-ticket', null, (nextTicket) => {
    // lblTicket.innerText = nextTicket; //->Con el callback solo escucha el usuario emisor
  });
})