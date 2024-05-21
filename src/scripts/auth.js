document.addEventListener('DOMContentLoaded', () => {
  const registerModal = document.getElementById('register-modal');
  const loginModal = document.getElementById('login-modal');
  const registerBtn = document.querySelector('.register-btn');
  const loginBtn = document.querySelector('.login-btn');
  const logoutBtn = document.querySelector('.logout-btn');
  const closeRegister = document.getElementById('close-register');
  const closeLogin = document.getElementById('close-login');
  const alertBox = document.getElementById('alert');
  const myLibraryLink = document.getElementById('my-library-link');
  const myLibraryItem = document.querySelector('.my-library');

  // Funkcja do wyświetlania komunikatów
  const showAlert = message => {
    alertBox.textContent = message;
    alertBox.style.opacity = '1';
    alertBox.style.display = 'block';
    setTimeout(() => {
      alertBox.style.opacity = '0';
      setTimeout(() => {
        alertBox.style.display = 'none';
      }, 500);
    }, 3000);
  };

  // Sprawdzenie, czy użytkownik jest zalogowany
  const checkLoginStatus = () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
      myLibraryItem.style.display = 'block';
      // Dynamiczny import fetch
      import('./fetch')
        .then(module => {
          console.log('Fetch module loaded:', module);
        })
        .catch(err => {
          console.error('Failed to load fetch module:', err);
        });
    } else {
      loginBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
      myLibraryItem.style.display = 'none';
    }
  };

  registerBtn.addEventListener('click', () => {
    registerModal.style.display = 'block';
  });

  loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    showAlert('Logged out successfully');
    checkLoginStatus();
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

    if (localStorage.getItem(email)) {
      showAlert('User already exists');
    } else {
      localStorage.setItem(email, password);
      showAlert('Registration successful');
      registerModal.style.display = 'none';
    }
  });

  // Logowanie użytkownika
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const storedPassword = localStorage.getItem(email);
    if (storedPassword && storedPassword === password) {
      localStorage.setItem('loggedInUser', email);
      showAlert('Login successful');
      loginModal.style.display = 'none';
      checkLoginStatus();
    } else {
      showAlert('Invalid login credentials');
    }
  });

  // Obsługa kliknięcia "My Library"
  myLibraryLink.addEventListener('click', e => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
      e.preventDefault();
      showAlert('Please login to access My Library');
      loginModal.style.display = 'block';
    }
  });

  checkLoginStatus();
});
