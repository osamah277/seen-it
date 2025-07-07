const form = document.getElementById('movie-form');
const input = document.getElementById('movie-input');
const watchlistEl = document.getElementById('watchlist');
const watchedEl = document.getElementById('watched');

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
let watched = JSON.parse(localStorage.getItem('watched')) || [];

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

function deleteFromWatchlist(title) {
  watchlist = watchlist.filter(item => item !== title);
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

  watchlist.forEach(title => {
    const li = document.createElement('li');
    li.textContent = title;

    const btnWatched = document.createElement('button');
    btnWatched.textContent = 'Watched';
    btnWatched.onclick = () => markAsWatched(title);

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.classList.add('delete-btn');
    btnDelete.onclick = () => deleteFromWatchlist(title);

    li.appendChild(btnWatched);
    li.appendChild(btnDelete);
    watchlistEl.appendChild(li);
  });

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
