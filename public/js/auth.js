async function handleCredentialResponse(response) {
  const body = {
    id_token : response.credential
  }

  try {
    const data = await googleSignIn(body);

    localStorage.setItem('email', data.user.email);
    localStorage.setItem('token', data.token);
    window.location = 'chat.html';
  } catch (error) {
    console.log(error);
    localStorage.setItem('email', error.details.extra);
    googleSignOut()
  }
}

async function googleSignIn(body) {
  const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth/google'
  : 'https://flutter-chat-back.herokuapp.com/api/auth/google'

  const response = await fetch(url, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if(data.error){
    throw data;
  }

  return data;
}

function googleSignOut(event) {
  if(!localStorage.getItem('email')){
    console.log('User not logged');
    return;
  }

  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem('email'), (done) => {
    localStorage.clear();
    location.reload();
  });
}


const form = document.querySelector('#form');
const email = document.querySelector('#email');
const password = document.querySelector('#password');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    email: email.value,
    password: password.value
  }

  try {
    const data = await login(body);

    localStorage.setItem('token', data.token);
    window.location = 'chat.html';
  } catch (error) {
    console.log(error);
  }
});

async function login(body){
  const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080/api/auth/login'
  : 'https://flutter-chat-back.herokuapp.com/api/auth/login'

  const response = await fetch(url, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if(data.error){
    throw data;
  }

  return data;
}
