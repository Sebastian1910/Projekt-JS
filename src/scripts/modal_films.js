import Notiflix from 'notiflix';
//import z biblioteki tylko jaki?????//

const modalDiv = document.querySelector('#modal-window');
const filmModal = document.querySelector('.modal-content');
const overlay = document.querySelector('.modal-filmoteka');

export async function openModal(e) {
  const thisMovieId = e.currentTarget.querySelector//('#movieid?? - skąd wziąć').innerHTML;
  //console.log(thisMovieId);
  await renderModal(thisMovieId);
  modalDiv.classList.remove('is-hidden');
  overlay.classList.remove('is-hidden');

  const closeModalBtn = document.querySelector('.modal-close-btn');
  const addWatchedRef = document.querySelector('.add-watched');
  const addQueueRef = document.querySelector('.add-queue');

  //---Powiadomienia notiflix - dodanie i usunięcię z queue/watched
  const addedToWatched = () => {
    Notiflix.Notify.info(`The movie has been added to watched`);
  };

  const addedToQueue = () => {
    Notiflix.Notify.info(`The movie has been added to the queue`);
  };

  const removeFromWatched = () => {
    Notiflix.Notify.info(`The movie has been removed from watched`);
  };

  const removeFromQueue = () => {
    Notiflix.Notify.info(`The movie has been removed from the queue`);
  };

  try {
    const moviesWatched = JSON.parse(localStorage.getItem('movies-watched')) || [];
    //---Jeśli jest coś w local storage, to zmień content buttona i przechowaj
    for (const movie of moviesWatched) {
      if (String(movie.id) === thisMovieId) {
        addWatchedRef.textContent = 'remove from watched';
      }
    }
  } catch (error) {
    Notiflix.Notify.failure('Failed to get watched movie(s) from local storage');
    console.log(`Error getting watched movie(s) from local storage: ${error}`);
  }


  try {
    const moviesQueue = JSON.parse(localStorage.getItem('movies-queue')) || [];
    for (const movieQueue of moviesQueue) {
      if (String(movieQueue.id) === thisMovieId) {
        addQueueRef.textContent = 'remove from queue';
      }
    }
  } catch (error) {
    Notiflix.Notify.failure('Failed to get queued movie(s) from local storage');
    console.log(`Error getting queued movie(s) from local storage: ${error}`);
  }




  closeModalBtn.addEventListener('click', closeModal);
  addWatchedRef.addEventListener('click', () => {
    onWatchedClick();
  });
  addQueueRef.addEventListener('click', onQueueClick);
}

function closeModal(e) {
  e.preventDefault();
  modalDiv.classList.add('is-hidden');
  overlay.classList.add('is-hidden');
}

overlay.addEventListener('click', closeModal);
window.addEventListener('keydown', onEscKeyPress);

function onEscKeyPress(e) {
    const ESC_KEY_CODE = 'Escape';
    const isEscKey = e.code === ESC_KEY_CODE;
    if (isEscKey) {
        closeModal(e);
    }
}