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

let user = null;
let socket = null;

const main = async() => {
  socket = io('/chat', {
    auth: {
      token: localStorage.getItem('token')
    }
  });

  socket.on('connect', () => console.log('Server Connect'));

  socket.on('disconnect', () => console.log('Server Disconnect'));

  socket.on('connect_error', error => { //-Si ocurre un error se desconecta automaticamentes
    console.log('error: ', error.message);
    // window.location = '/';
  });
  
  socket.on('user-auth', ({authUser, newToken}) => {
    user = authUser;
    localStorage.setItem('token', newToken); //Alaraga la vida del token

    lblName.textContent = user.name
    console.log(`El usuario ${user.name} ha iniciado sesion`);
  })

  socket.on('user-connect', (name) => {
    console.log(`El usuario ${name} ha entrado al chat`);
  })

  socket.on('user-disconnect', (name) => {
    console.log(`El usuario ${name} abandono el chat`);
  })

  socket.on('incoming-message', ({messages=[{uid:'', name:'', message:''}], uid=''}) => {
    ulMessages.replaceChildren();

    messages.forEach(message => {
      const color = message.uid == user.uid ? '#41464b' : '#084298';
      const bgColor = message.uid == user.uid ? '#e2e3e5' : '#cfe2ff';
      const align = message.uid == user.uid ? 'justify-content-end' : 'justify-content-start'

      const li = document.createElement('li');
      li.className=`d-flex ${align}`;

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

  socket.on('users-changes', (users = [{name:'', uid:''}]) => {
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

  socket.on('incoming-private-message', (payload) => {
    console.log('private message: ', payload)
  })
}

inputMessage.addEventListener('keyup', ({keyCode}) => {
  const message = inputMessage.value;
  const uid = inputUid.value;
  
  if(keyCode == 13 && message.length){
    socket.emit('outcoming-message', {message, uid});
    inputMessage.value = '';
  }
})

btnLogout.addEventListener('click', () => {
  if(user.google){
    console.log(google.accounts);
    google.accounts.id.disableAutoSelect();
    // google.accounts.id.revoke(user.email);
  }

  // localStorage.clear();
  window.location = '/';
});

main();