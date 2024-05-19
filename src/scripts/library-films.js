import { createModal } from "./fetch";

document.addEventListener('DOMContentLoaded', () => {
  const watchedBtn = document.querySelector('.button-watched');
  const queueBtn = document.querySelector('.button-queue');
  const galleryLib = document.querySelector('.gallery_lib ul');
  const emptyLibraryText = document.querySelector('.library_text_empty');
  const libraryImgContainer = document.querySelector('.library_img_container');

  function displayMoviesFromStorage(storageKey) {
    const movies = JSON.parse(localStorage.getItem(storageKey)) || [];

    galleryLib.innerHTML = '';

    if (movies.length === 0) {
      emptyLibraryText.style.display = 'block';
      libraryImgContainer.style.display = 'block';
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

  // Initial display of watched movies when the page loads
  displayMoviesFromStorage('movies-watched');
});

function openModal(movie) {
  const modal = document.querySelector('.modal-custom');
  modal.querySelector(
    '.modal-poster-custom'
  ).src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  modal.querySelector('.modal-title-custom').textContent = movie.title;
  modal.querySelector('.modal-vote-value-custom').textContent = movie.vote_average;
  modal.querySelector('.modal-vote-count-custom').textContent = movie.vote_count;
  modal.querySelector('.modal-popularity-value-custom').textContent = movie.popularity;
  modal.querySelector('.modal-original-title-value-custom').textContent = movie.original_title;
  modal.querySelector('.modal-genre-value-custom').textContent = movie.genres.join(', ');
  modal.querySelector('.modal-description-custom').textContent = movie.overview;
  modal.style.display = 'block';

  const closeButton = modal.querySelector('.close-button-custom');
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  function closeModal() {
    modal.style.display = 'none';
  }

  document.querySelector('.modal-buttons-custom').style.display = 'none';

}
