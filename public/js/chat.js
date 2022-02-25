// const { io } = require("socket.io-client");

const lblOnline = document.querySelector('#lblOnline');
const lblOffline = document.querySelector('#lblOffline');

const inputMsg = document.querySelector('#inputMsg');
const sendBtn = document.querySelector('#sendBtn');

//Esta carpeta no entiende el require o import, por que no esta dentro de un entorno de node, por lo tanto
//-para este caso de vanilla javascript tenemos que trabajar si tipado
const socket = io();

socket.on('connect', () => {
  console.log('Server Connected (From Client)');

  lblOffline.style.display = 'none';
  lblOnline.style.display = '';
});

socket.on('disconnect', () => {
  console.log('Server Disconnected (From Client)');

  lblOffline.style.display = '';
  lblOnline.style.display = 'none';
});

socket.on('server-response', (payload) => {
  console.log('Server response the sent message: %O', payload);
});

sendBtn.addEventListener('click', () => {
  const payload = {
    message: inputMsg.value,
    id: '123456',
    date: new Date().getTime()
  }

  //-El tercer parametro es la retroalimentacion del cliente hacia el servidor
  socket.emit('client-message', payload, (feedback) => {
    console.log('Feedback from server, message id: %O', feedback); //Solo el dueño del mensaje recibe el feedback
  }) //-Envia a todos los 
});

