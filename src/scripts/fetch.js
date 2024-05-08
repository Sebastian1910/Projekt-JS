import { apiKey } from "./api-key";
import Notiflix from "notiflix";

const gallery = document.querySelector('.gallery');

async function fetchAndDisplay() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYzA0ZTAxMDQ5ZGY2YTlhNTFmMjI5OTk4MjM5NzM0NyIsInN1YiI6IjY2M2I3YmZiZGQ5OTgxOGU0ZThlZDhkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-V1V7iNIgAxWC5HtgNgrA9_tiFlCpkK3DLKfKQ3d1tg'
        }
    };

    try {
        const response = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', options);
        const data = await response.json();
        const movies = data.results;

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

            const title = document.createElement('h2');
            title.textContent = movie.title;
            title.classList.add('movie-title');
            card.appendChild(title);

            const subtitle = document.createElement('h3');
            const year = movie.release_date.substring(0, 4);
            const genre = movie.genres ? movie.genres.slice(0, 3).join(', ') : 'N/A';
            subtitle.textContent = `${genre} | ${year}`;
            card.appendChild(subtitle);
        
            gallery.appendChild(card);
        });
    } catch (error) {
        Notiflix.Notify.failure(`Search result not successful. Enter the correct movie name and`)
    }
    }    


window.onload = fetchAndDisplay;