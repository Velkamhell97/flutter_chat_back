//-DOOM
const lblName = document.querySelector('#lblName');
const btnLogout = document.querySelector('#btnLogout');

const inputMessage = document.querySelector('#inputMessage');
const inputUid = document.querySelector('#inputUid');
const btnRoom = document.querySelector('#btnRoom');

const divScroll = document.querySelector('#divScroll');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');

const usersFragment = document.createDocumentFragment();
const messagesFragment = document.createDocumentFragment();

const { room } = Object.fromEntries(new URLSearchParams(window.location.search));
let user = null;
let socket = null;

if(!room){
  window.location = '/';
}

const main = async() => {
  socket = io('/rooms', {
    auth: {
      token: localStorage.getItem('token')
    }
  });

  socket.on('connect', () =>  console.log(`Server Connected`));

  socket.on('disconnect', () => console.log('Server Disconnect'));

  socket.on('connect_error', error => {
    console.log('error: ', error.message);
    // window.location = '/';
  });

  socket.on('user-auth', ({authUser, newToken}) => {
    user = authUser;
    localStorage.setItem('token', newToken);

    lblName.textContent = user.name
    socket.emit('user-room-connect', room);
    console.log(`El usuario ${user.name} ha iniciado sesion en la sala ${room}`);
  })
  
  socket.on('user-room-connect', (name) => {
    console.log(`El usuario ${name} ha entrado a la sala ${room}`);
  })

  socket.on('user-room-disconnect', (name) => {
    console.log(`El usuario ${name} abandono la sala ${room}`);
  })

  socket.on('incoming-room-message', ({messages=[{uid:'', name:'', message:''}], uid=''}) => {
    ulMessages.replaceChildren();

    messages.forEach(message => {
      const color = message.uid == user.uid ? '#41464b' : '#084298';
      const bgColor = message.uid == user.uid ? '#e2e3e5' : '#cfe2ff';
      const align = message.uid == user.uid ? 'justify-content-end' : 'justify-content-start'

      const li = document.createElement('li');
      li.className=`d-flex ${align}`;
      li.tabIndex="1"

      const div = document.createElement('div');
      div.className = "p-2 rounded text-break mt-2"
      div.style.color = color;
      div.style.backgroundColor = bgColor;
      div.style.maxWidth = '75%'

      const span1 = document.createElement('span');
      span1.textContent = message.name + ': ';
      div.appendChild(span1);

      const span2 = document.createElement('span');
      span2.textContent = message.message;
      div.appendChild(span2);

      li.append(div);
      messagesFragment.appendChild(li);
    })

    ulMessages.appendChild(messagesFragment);

    if(uid == user.uid){
      divScroll.scroll({top: divScroll.scrollHeight, behavior: 'smooth'});
    }
  })

  socket.on('users-room-changes', (users = [{name:'', uid:''}]) => {
    ulUsers.replaceChildren();

    users.forEach(user => {
      const li = document.createElement('li');
      const p = document.createElement('p');
      
      const h5 = document.createElement('h5');
      h5.className = 'text-success';
      h5.textContent = user.name;
      p.appendChild(h5);

      const span = document.createElement('span');
      span.className = "fs-6 text-muted";
      span.textContent = user.uid;
      p.appendChild(span)

      li.appendChild(p);
      usersFragment.appendChild(li);
    })

    ulUsers.appendChild(usersFragment);
  })
}

inputMessage.addEventListener('keyup', ({keyCode}) => {
  const message = inputMessage.value;
  const uid = inputUid.value;
  
  if(keyCode == 13 && message.length){
    socket.emit('outcoming-room-message', {room, message, uid});
    inputMessage.value = '';
    divScroll.scroll({top: divScroll.scrollHeight, behavior: 'smooth'});
  }
})

btnBack.addEventListener('click', () => {
  window.location = 'chat.html';
});

main();