const apiKey = 'trilogy'; // Free demo API key for OMDb
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const moviesGrid = document.getElementById('moviesGrid');
const favoritesList = document.getElementById('favoritesList');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('errorMsg');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Initial render of favorites
renderFavorites();

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    }
});

// Button aur Input ko pakdo
const clearButton = document.getElementById('clearBtn');
const inputField = document.getElementById('userInput');

// Jab button par click ho
clearButton.addEventListener('click', function() {
    inputField.value = ''; // Input box ko ekdum khali kar dega
    inputField.focus();    // Wapas cursor ko wahi le aayega
});


searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            fetchMovies(query);
        }
    }
});

async function fetchMovies(query) {
    loadingDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    moviesGrid.innerHTML = '';

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
        const data = await response.json();

        loadingDiv.classList.add('hidden');

        if (data.Response === 'True') {
            displayMovies(data.Search);
        } else {
            errorDiv.textContent = data.Error || 'No movies found.';
            errorDiv.classList.remove('hidden');
        }
    } catch (err) {
        loadingDiv.classList.add('hidden');
        errorDiv.textContent = 'Something went wrong. Please check your connection.';
        errorDiv.classList.remove('hidden');
    }
}

function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');

        const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/140x180?text=No+Image';

        card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
            <div class="movie-info">
                <div>
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                </div>
                <button class="fav-btn" onclick='addFavorite("${movie.imdbID}", "${encodeURIComponent(movie.Title)}", "${movie.Year}")'>⭐ Favorite</button>
            </div>
        `;
        moviesGrid.appendChild(card);
    });
}

window.addFavorite = function(id, titleEncoded, year) {
    const title = decodeURIComponent(titleEncoded);
    if (!favorites.some(fav => fav.id === id)) {
        favorites.push({ id, title, year });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
    }
};

window.removeFavorite = function(id) {
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
};

function renderFavorites() {
    favoritesList.innerHTML = '';
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p style="font-size:12px; color:#94a3b8;">No favorites added yet.</p>';
        return;
    }

    favorites.forEach(fav => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${fav.title} (${fav.year})</span>
            <button onclick="removeFavorite('${fav.id}')">Remove</button>
        `;
        favoritesList.appendChild(li);
    });
}
const clearBtn = document.getElementById('clearBtn');

clearBtn.addEventListener('click', () => {
    searchInput.value = ''; // Input box ko khali karega
    moviesGrid.innerHTML = ''; // Movies grid ko saaf karega
    errorDiv.classList.add('hidden'); // Agar koi error ho toh chupayega
    searchInput.focus(); // Wapas input box par focus layega
});