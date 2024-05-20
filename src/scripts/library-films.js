import { createModal, openModal } from './fetch';

document.addEventListener('DOMContentLoaded', () => {
  const watchedBtn = document.querySelector('.button-watched');
  const queueBtn = document.querySelector('.button-queue');
  const galleryLib = document.querySelector('.gallery_lib ul');
  const emptyLibraryText = document.querySelector('.library_text_empty');
  const libraryImgContainer = document.querySelector('.library_img_container');

  if (!watchedBtn || !queueBtn || !galleryLib || !emptyLibraryText || !libraryImgContainer) {
    console.error('One or more required elements are missing from the DOM');
    return;
  }

  function displayMoviesFromStorage(storageKey) {
    const movies = JSON.parse(localStorage.getItem(storageKey)) || [];

    galleryLib.innerHTML = '';

    if (movies.length === 0) {
      emptyLibraryText.style.display = 'block';
      libraryImgContainer.style.display = 'flex';
    } else {
      emptyLibraryText.style.display = 'none';
      libraryImgContainer.style.display = 'none';

      movies.forEach(movie => {
        const card = document.createElement('li');
        card.classList.add('card');

        const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        const posterImage = document.createElement('img');
        posterImage.src = posterUrl;
        posterImage.alt = movie.title;
        posterImage.classList.add('movie-poster');
        card.appendChild(posterImage);

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');
        card.appendChild(movieInfo);

        const title = document.createElement('h2');
        title.textContent = movie.title;
        title.classList.add('movie-title');
        movieInfo.appendChild(title);

        const subtitle = document.createElement('h3');
        const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
        const genre = movie.genres ? movie.genres.slice(0, 2).join(', ') : 'N/A';
        subtitle.textContent = `${genre} | ${year}`;
        subtitle.classList.add('movie-subtitle');
        movieInfo.appendChild(subtitle);

        card.addEventListener('click', () => openModal(movie));

        galleryLib.appendChild(card);
      });
    }
  }

  watchedBtn.addEventListener('click', () => {
    watchedBtn.classList.add('active');
    queueBtn.classList.remove('active');
    displayMoviesFromStorage('movies-watched');
  });

  queueBtn.addEventListener('click', () => {
    queueBtn.classList.add('active');
    watchedBtn.classList.remove('active');
    displayMoviesFromStorage('movies-queue');
  });

  displayMoviesFromStorage('movies-watched');
});

// function openModal(movie) {
//   const modal = document.querySelector('.modal-custom');
//   if (!modal) {
//     console.error('Modal element is missing from the DOM');
//     return;
//   }

//   modal.querySelector(
//     '.modal-poster-custom',
//   ).src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
//   modal.querySelector('.modal-title-custom').textContent = movie.title;
//   modal.querySelector('.modal-vote-value-custom').textContent = movie.vote_average;
//   modal.querySelector('.modal-vote-count-custom').textContent = movie.vote_count;
//   modal.querySelector('.modal-popularity-value-custom').textContent = movie.popularity;
//   modal.querySelector('.modal-original-title-value-custom').textContent = movie.original_title;
//   modal.querySelector('.modal-genre-value-custom').textContent = movie.genres.join(', ');
//   modal.querySelector('.modal-description-custom').textContent = movie.overview;
//   modal.style.display = 'block';

//   const addWatchedRef = modal.querySelector('.add-to-watched-custom');
//   const addQueueRef = modal.querySelector('.add-to-queue-custom');

//   if (!addWatchedRef || !addQueueRef) {
//     console.error('Add to Watched or Add to Queue buttons are missing from the modal');
//     return;
//   }

//   const thisMovieId = movie.id.toString();

//   const moviesWatched = JSON.parse(localStorage.getItem('movies-watched')) || [];
//   const moviesQueue = JSON.parse(localStorage.getItem('movies-queue')) || [];

//   if (moviesWatched.some(m => m.id === movie.id)) {
//     addWatchedRef.textContent = 'REMOVE FROM WATCHED';
//   } else {
//     addWatchedRef.textContent = 'ADD TO WATCHED';
//   }

//   if (moviesQueue.some(m => m.id === movie.id)) {
//     addQueueRef.textContent = 'REMOVE FROM QUEUE';
//   } else {
//     addQueueRef.textContent = 'ADD TO QUEUE';
//   }

//   addWatchedRef.onclick = function () {
//     let moviesWatched = JSON.parse(localStorage.getItem('movies-watched')) || [];
//     if (moviesWatched.some(m => m.id === movie.id)) {
//       moviesWatched = moviesWatched.filter(m => m.id !== movie.id);
//       localStorage.setItem('movies-watched', JSON.stringify(moviesWatched));
//       addWatchedRef.textContent = 'ADD TO WATCHED';
//     } else {
//       moviesWatched.push(movie);
//       localStorage.setItem('movies-watched', JSON.stringify(moviesWatched));
//       addWatchedRef.textContent = 'REMOVE FROM WATCHED';
//     }
//   };

//   addQueueRef.onclick = function () {
//     let moviesQueue = JSON.parse(localStorage.getItem('movies-queue')) || [];
//     if (moviesQueue.some(m => m.id === movie.id)) {
//       moviesQueue = moviesQueue.filter(m => m.id !== movie.id);
//       localStorage.setItem('movies-queue', JSON.stringify(moviesQueue));
//       addQueueRef.textContent = 'ADD TO QUEUE';
//     } else {
//       moviesQueue.push(movie);
//       localStorage.setItem('movies-queue', JSON.stringify(moviesQueue));
//       addQueueRef.textContent = 'REMOVE FROM QUEUE';
//     }
//   };
// }
