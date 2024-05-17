import Notiflix from 'notiflix';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
import { debounce } from 'lodash';
import { displayMovies } from './fetch';

const searchInput = document.querySelector('.form-input');
const searchForm = document.querySelector('.header_search_form');
const gallery = document.querySelector('.gallery');
const pagContainer = document.querySelector('#tui-pagination-container');

let genresList = [];
const moviesPerPage = 20;
let notificationDisplayed = false;

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function fetchGenres() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer YOUR_API_KEY',
    },
  };

  try {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list', options);
    const data = await response.json();
    genresList = data.genres;
  } catch (error) {
    Notiflix.Notify.failure(`Error`);
  }
}

function clearMovies() {
  gallery.innerHTML = '';
}

function showNoResults() {
  const noResultsInfo = document.createElement('div');
  noResultsInfo.classList.add('no-results-info');
  gallery.appendChild(noResultsInfo);
  Notiflix.Notify.warning(
    'Search result not successful. Enter the correct movie name and try again.',
  );
}

async function searchMovies(query, page) {
  await fetchGenres();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer YOUR_API_KEY',
    },
  };

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
    options,
  );
  const data = await response.json();
  const movies = data.results;
  const totalResults = data.total_results;

  movies.forEach(movie => {
    movie.genres = movie.genre_ids
      .map(id => {
        const genre = genresList.find(genre => genre.id === id);
        return genre ? genre.name : null;
      })
      .filter(name => name !== null);
  });

  const totalItems = 400;
  const totalPages = Math.ceil(totalItems / moviesPerPage);

  return { movies, totalItems, totalPages, totalResults };
}

function createModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal-custom');
  modal.innerHTML = `
    <div class="modal-content-custom">
      <span class="close-button-custom">&times;</span>
      <img class="modal-poster-custom" src="" alt="Plakat filmu">
      <div class="modal-details-custom">
        <h2 class="modal-title-custom"></h2>
        <ul class="modal-info-custom">
          <li class="modal-votes-custom"><strong>Vote / Votes:</strong> <span class="modal-vote-value-custom"></span> / <span class="modal-vote-count-custom"></span></li>
          <li class="modal-popularity-custom"><strong>Popularity:</strong> <span class="modal-popularity-value-custom"></span></li>
          <li class="modal-original-title-custom"><strong>Original Title:</strong> <span class="modal-original-title-value-custom"></span></li>
          <li class="modal-genre-custom"><strong>Genre:</strong> <span class="modal-genre-value-custom"></span></li>
        </ul>
        <div class="modal-about-custom">
          <h3>About</h3>
          <p class="modal-description-custom"></p>
        </div>
        <div class="modal-buttons-custom">
          <button class="add-to-watched-custom">ADD TO WATCHED</button>
          <button class="add-to-queue-custom">ADD TO QUEUE</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

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

  return modal;
}

const modal = createModal();

function openModal(movie) {
  modal.querySelector('.modal-poster-custom').src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
  modal.querySelector('.modal-title-custom').textContent = movie.title;
  modal.querySelector('.modal-vote-value-custom').textContent = movie.vote_average.toFixed(1);
  modal.querySelector('.modal-vote-count-custom').textContent = movie.vote_count;
  modal.querySelector('.modal-popularity-value-custom').textContent = movie.popularity;
  modal.querySelector('.modal-original-title-value-custom').textContent = movie.original_title;
  modal.querySelector('.modal-genre-value-custom').textContent = movie.genres.join(', ');
  modal.querySelector('.modal-description-custom').textContent = movie.overview;
  modal.style.display = 'block';
}

async function displaySearchedMovies(page = 1) {
  const searchQuery = searchInput.value.trim();
  const placeholder =
    'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

  try {
    const { movies, totalResults } = await searchMovies(searchQuery, page);

    if (totalResults === 0) {
      clearMovies();
      showNoResults();
      pagContainer.innerHTML = '';
      const totalItems = 0;
      const pagination = new Pagination(pagContainer, {
        totalItems,
        itemsPerPage: 20,
        visiblePages: 1,
        page: 1,
        centerAlign: true,
        template: {
          page: '<a href="#" class="tui-page-btn">{{page}}</a>',
          currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
          moveButton:
            '<a href="#" class="tui-page-btn tui-{{type}}">' +
            '<span class="tui-ico-{{type}}">{{type}}</span>' +
            '</a>',
          disabledMoveButton:
            '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
            '<span class="tui-ico-{{type}}">{{type}}</span>' +
            '</span>',
          moreButton:
            '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
            '<span class="tui-ico-ellip">...</span>' +
            '</a>',
        },
      });
      return;
    }

    if (page === 1) {
      notificationDisplayed = false;
    }

    if (!notificationDisplayed) {
      Notiflix.Notify.success(`Hooray! We have found ${totalResults} movies!`);
      notificationDisplayed = true;
    }

    gallery.innerHTML = '';
    movies.forEach(movie => {
      const card = document.createElement('div');
      card.classList.add('card');
      gallery.appendChild(card);

      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : placeholder;
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
      const year = movie.release_date ? movie.release_date.substring(0, 4) : 'Unknown';
      const genre = movie.genres ? movie.genres.slice(0, 2).join(', ') : 'N/A';
      subtitle.textContent = `${genre} | ${year}`;
      subtitle.classList.add('movie-subtitle');
      movieInfo.appendChild(subtitle);

      const ratingInfo = document.createElement('span');
      const rating = movie.vote_average.toFixed(1);
      ratingInfo.textContent = `${rating}`;
      ratingInfo.classList.add('rating-info');
      movieInfo.appendChild(ratingInfo);

      let styleColor;
      switch (true) {
        case rating >= 8:
          styleColor = '#00e600';
          break;
        case rating >= 6:
          styleColor = '#ffff00';
          break;
        case rating < 5.99:
          styleColor = '#ff0000';
          break;
        default:
          styleColor = 'black';
      }

      if (rating < 0.05) {
        ratingInfo.style.display = 'none';
      }

      ratingInfo.style.color = styleColor;
      ratingInfo.style.borderColor = styleColor;

      card.addEventListener('click', () => openModal(movie));
    });

    const totalItems = totalResults;

    pagContainer.innerHTML = '';

    const pagination = new Pagination(pagContainer, {
      totalItems,
      itemsPerPage: 20,
      visiblePages: 5,
      page,
      centerAlign: true,
      template: {
        page: '<a href="#" class="tui-page-btn">{{page}}</a>',
        currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
        moveButton:
          '<a href="#" class="tui-page-btn tui-{{type}}">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
          '</a>',
        disabledMoveButton:
          '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
          '<span class="tui-ico-{{type}}">{{type}}</span>' +
          '</span>',
        moreButton:
          '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
          '<span class="tui-ico-ellip">...</span>' +
          '</a>',
      },
    });

    pagination.on('afterMove', async e => {
      await displaySearchedMovies(e.page);
      scrollToTop();
    });
  } catch (error) {
    Notiflix.Notify.failure(
      `Search result not successful. Enter the correct movie name and try again`,
    );
  }
}

function searchHandler() {
  const input = searchInput.value.trim();

  if (input === '') {
    return Notiflix.Notify.warning('You need to type something here...');
  }

  displaySearchedMovies();
}

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  debounce(searchHandler, 300)();
});
