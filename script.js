const form = document.getElementById('movie-form');
const input = document.getElementById('movie-input');
const watchlistEl = document.getElementById('watchlist');
const watchedEl = document.getElementById('watched');
const modeToggle = document.getElementById('mode-toggle');

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
let watched = JSON.parse(localStorage.getItem('watched')) || [];

// Load saved mode
if (localStorage.getItem('mode') === 'dark') {
  document.body.classList.add('dark');
  modeToggle.textContent = '☀️';
}

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('mode', isDark ? 'dark' : 'light');
  modeToggle.textContent = isDark ? '☀️' : '🌙';
});

function saveLists() {
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  localStorage.setItem('watched', JSON.stringify(watched));
}

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

function markAsWatched(title) {
  watchlist = watchlist.filter(item => item !== title);
  watched.push(title);
  renderLists();
  saveLists();
}

function deleteFromWatched(title) {
  watched = watched.filter(item => item !== title);
  renderLists();
  saveLists();
}

function renderLists() {
  watchlistEl.innerHTML = '';
  watchedEl.innerHTML = '';

  // Watchlist: Only "Watched" button
  watchlist.forEach(title => {
    const li = document.createElement('li');
    li.textContent = title;

    const btnWatched = document.createElement('button');
    btnWatched.textContent = 'Watched';
    btnWatched.onclick = () => markAsWatched(title);

    li.appendChild(btnWatched);
    watchlistEl.appendChild(li);
  });

  // Watched: Only "Delete" button
  watched.forEach(title => {
    const li = document.createElement('li');
    li.textContent = title;

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.classList.add('delete-btn');
    btnDelete.onclick = () => deleteFromWatched(title);

    li.appendChild(btnDelete);
    watchedEl.appendChild(li);
  });
}

renderLists();
