const form = document.getElementById('movie-form');
const input = document.getElementById('movie-input');
const watchlistEl = document.getElementById('watchlist');
const watchedEl = document.getElementById('watched');

// Local storage state
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
let watched = JSON.parse(localStorage.getItem('watched')) || [];

// Save to local storage
function saveLists() {
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  localStorage.setItem('watched', JSON.stringify(watched));
}

// Add new movie/show
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const title = input.value.trim();
  if (title && !watchlist.includes(title) && !watched.includes(title)) {
    watchlist.push(title);
    input.value = '';
    renderLists();
    saveLists();
  }
});

// Move from watchlist to watched
function markAsWatched(title) {
  watchlist = watchlist.filter(item => item !== title);
  watched.push(title);
  renderLists();
  saveLists();
}

// Render lists
function renderLists() {
  watchlistEl.innerHTML = '';
  watchedEl.innerHTML = '';

  watchlist.forEach(title => {
    const li = document.createElement('li');
    li.textContent = title;
    const btn = document.createElement('button');
    btn.textContent = 'Watched';
    btn.onclick = () => markAsWatched(title);
    li.appendChild(btn);
    watchlistEl.appendChild(li);
  });

  watched.forEach(title => {
    const li = document.createElement('li');
    li.textContent = title;
    watchedEl.appendChild(li);
  });
}

// Initialize
renderLists();
