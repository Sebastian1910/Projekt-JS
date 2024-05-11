import { apiKey } from "./api-key";
import Notiflix from "notiflix";
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

const gallery = document.querySelector('.gallery');
const pagContainer = document.querySelector('#tui-pagination-container');

const moviesPerPage = 20;
let currentPage = 1;
let genresList = [];

async function fetchGenres() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYzA0ZTAxMDQ5ZGY2YTlhNTFmMjI5OTk4MjM5NzM0NyIsInN1YiI6IjY2M2I3YmZiZGQ5OTgxOGU0ZThlZDhkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-V1V7iNIgAxWC5HtgNgrA9_tiFlCpkK3DLKfKQ3d1tg'
        }
    };

    try {
        const response = await fetch('https://api.themoviedb.org/3/genre/movie/list', options);
        const data = await response.json();
        genresList = data.genres;
    } catch (error) {
        Notiflix.Notify.failure(`Error`)
    }
}

async function fetchMovies(page) {
    await fetchGenres();

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYzA0ZTAxMDQ5ZGY2YTlhNTFmMjI5OTk4MjM5NzM0NyIsInN1YiI6IjY2M2I3YmZiZGQ5OTgxOGU0ZThlZDhkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-V1V7iNIgAxWC5HtgNgrA9_tiFlCpkK3DLKfKQ3d1tg'        }
    };

    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${page}`, options);
    const data = await response.json();
    const movies = data.results;

    movies.forEach(movie => {
        movie.genres = movie.genre_ids
            .map(id => {
                const genre = genresList.find(genre => genre.id === id);
                return genre ? genre.name : null;
            })
            .filter(name => name !== null);
    });

    const totalItems = data.total_results;
    const totalPages = Math.ceil(totalItems / moviesPerPage);

    return { movies, totalItems, totalPages };
}

async function displayMovies() {
    try {
        const { movies, totalItems } = await fetchMovies(currentPage);

        gallery.innerHTML = '';
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.classList.add('card');
            gallery.appendChild(card);

            const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            const posterImage = document.createElement('img');
            posterImage.src = posterUrl;
            posterImage.alt = movie.title;
            posterImage.classList.add('movie-poster');
            card.appendChild(posterImage);

            const movieInfo = document.createElement('div');
            movieInfo.classList.add('movie-info');
            card.appendChild(movieInfo)

            const title = document.createElement('h2');
            title.textContent = movie.title;
            title.classList.add('movie-title');
            movieInfo.appendChild(title);

            const subtitle = document.createElement('h3');
            const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
            const genre = movie.genres ? movie.genres.slice(0, 3).join(', ') : 'N/A';
            subtitle.textContent = `${genre} | ${year}`;
            subtitle.classList.add('movie-subtitle');
            movieInfo.appendChild(subtitle);
        });

        pagContainer.innerHTML = '';
        const pagination = new Pagination(pagContainer, {
            totalItems,
            itemsPerPage: moviesPerPage,
            visiblePages: 5,
            page: currentPage,
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
                    '</a>'
            }
        });

        pagination.on('afterMove', async e => {
            currentPage = e.page;
            await displayMovies();
        });
    } catch (error) {
        Notiflix.Notify.failure(`Search result not successful. Enter the correct movie name and`);
    }
}

displayMovies();
