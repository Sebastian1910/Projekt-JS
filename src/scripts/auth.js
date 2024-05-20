import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import app from './firebase-config';

const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const registerModal = document.getElementById('register-modal');
  const loginModal = document.getElementById('login-modal');
  const registerBtn = document.querySelector('.register-btn');
  const loginBtn = document.querySelector('.login-btn');
  const closeRegister = document.getElementById('close-register');
  const closeLogin = document.getElementById('close-login');

  registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'block';
  });

  loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
  });

  closeRegister.addEventListener('click', () => {
    registerModal.style.display = 'none';
  });

  closeLogin.addEventListener('click', () => {
    loginModal.style.display = 'none';
  });

  window.addEventListener('click', event => {
    if (event.target === registerModal) {
      registerModal.style.display = 'none';
    }
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });

  // Rejestracja użytkownika
  const registerForm = document.getElementById('register-form');
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        console.log('Registered:', userCredential.user);
        registerModal.style.display = 'none';
      })
      .catch(error => {
        console.error('Error registering:', error);
      });
  });

  // Logowanie użytkownika
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        console.log('Logged in:', userCredential.user);
        loginModal.style.display = 'none';
      })
      .catch(error => {
        console.error('Error logging in:', error);
      });
  });
});
