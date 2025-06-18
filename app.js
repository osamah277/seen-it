// Your Firebase config here (replace with your own config)
const firebaseConfig = {
  apiKey: "AIzaSyChgVIPxsSrmsKo8cL2gpMMf9bUioLKgd4",
  authDomain: "seen-it-d5731.firebaseapp.com",
  projectId: "seen-it-d5731",
  storageBucket: "seen-it-d5731.firebasestorage.app",
  messagingSenderId: "539164904581",
  appId: "1:539164904581:web:b17edd8d48c333be61edec",
  measurementId: "G-YEJBLCXM0G"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loadingDiv = document.getElementById('loading');
const authContainer = document.getElementById('auth-container');
const appDiv = document.getElementById('app');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signInBtn = document.getElementById('sign-in-btn');
const registerBtn = document.getElementById('register-btn');
const googleSignInBtn = document.getElementById('google-signin-btn');
const errorMsg = document.getElementById('error-msg');

const userNameSpan = document.getElementById('user-name');
const signOutBtn = document.getElementById('sign-out-btn');

const movieTitleInput = document.getElementById('movie-title');
const movieTypeSelect = document.getElementById('movie-type');
const addMovieBtn = document.getElementById('add-movie-btn');
const movieErrorMsg = document.getElementById('movie-error-msg');
const moviesList = document.getElementById('movies-list');
const addMovieSection = document.getElementById('admin-controls');

const modeToggleBtn = document.getElementById('mode-toggle');

let currentUser = null;

function showLoading() {
  loadingDiv.style.display = 'block';
  authContainer.style.display = 'none';
  appDiv.style.display = 'none';
}

function showAuth() {
  loadingDiv.style.display = 'none';
  authContainer.style.display = 'block';
  appDiv.style.display = 'none';
}

function showApp(user) {
  currentUser = user;
  loadingDiv.style.display = 'none';
  authContainer.style.display = 'none';
  appDiv.style.display = 'block';
  userNameSpan.textContent = user.email || user.displayName || 'User';
  errorMsg.textContent = '';
  movieErrorMsg.textContent = '';
  movieTitleInput.value = '';
  movieTypeSelect.value = 'movie';
  addMovieSection.style.display = (user.email === 'osamah@gmail.com') ? 'block' : 'none';
  loadMovies();
}

auth.onAuthStateChanged(user => {
  if (user) {
    showApp(user);
  } else {
    currentUser = null;
    showAuth();
    moviesList.innerHTML = '';
  }
});

signInBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    errorMsg.textContent = "Please enter email and password.";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      errorMsg.textContent = '';
      emailInput.value = '';
      passwordInput.value = '';
    })
    .catch(error => {
      errorMsg.textContent = error.message;
    });
});

registerBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    errorMsg.textContent = "Please enter email and password.";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      errorMsg.textContent = '';
      emailInput.value = '';
      passwordInput.value = '';
    })
    .catch(error => {
      errorMsg.textContent = error.message;
    });
});

googleSignInBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then(() => {
      errorMsg.textContent = '';
    })
    .catch(error => {
      errorMsg.textContent = error.message;
    });
});

signOutBtn.addEventListener('click', () => {
  auth.signOut();
});

function loadMovies() {
  moviesList.innerHTML = '';

  db.collection('movies')
    .orderBy('addedAt', 'desc')
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        moviesList.innerHTML = '<li>No movies or TV shows added yet.</li>';
        return;
      }

      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement('li');
        li.textContent = `${data.title} (${data.type})`;

        if (currentUser?.email === 'osamah@gmail.com') {
          const btnContainer = document.createElement('span');
          btnContainer.className = 'movie-buttons';

          const editBtn = document.createElement('button');
          editBtn.type = 'button';
          editBtn.textContent = 'Edit';
          editBtn.onclick = () => editMovie(doc.id, data.title, data.type);

          const deleteBtn = document.createElement('button');
          deleteBtn.type = 'button';
          deleteBtn.textContent = 'Delete';
          deleteBtn.onclick = () => deleteMovie(doc.id);

          btnContainer.appendChild(editBtn);
          btnContainer.appendChild(deleteBtn);
          li.appendChild(btnContainer);
        }

        moviesList.appendChild(li);
      });
    })
    .catch(error => {
      movieErrorMsg.textContent = 'Failed to load movies: ' + error.message;
    });
}

addMovieBtn.addEventListener('click', () => {
  const title = movieTitleInput.value.trim();
  const type = movieTypeSelect.value;

  if (!title) {
    movieErrorMsg.textContent = 'Please enter a title.';
    return;
  }
  if (!currentUser) {
    movieErrorMsg.textContent = 'User not signed in.';
    return;
  }

  db.collection('movies').add({
    uid: currentUser.uid,
    title,
    type,
    addedAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    movieErrorMsg.textContent = '';
    movieTitleInput.value = '';
    movieTypeSelect.value = 'movie';
    loadMovies();
  })
  .catch(error => {
    movieErrorMsg.textContent = 'Failed to add movie: ' + error.message;
  });
});

function editMovie(docId, currentTitle, currentType) {
  const newTitle = prompt('Edit title:', currentTitle);
  if (!newTitle) return;

  const newType = prompt('Edit type (movie/tv):', currentType);
  if (!newType) return;

  if (newType !== 'movie' && newType !== 'tv') {
    alert('Type must be either "movie" or "tv". Edit cancelled.');
    return;
  }

  db.collection('movies').doc(docId).update({
    title: newTitle,
    type: newType
  })
  .then(() => loadMovies())
  .catch(error => {
    movieErrorMsg.textContent = 'Failed to edit movie: ' + error.message;
  });
}

function deleteMovie(docId) {
  if (!confirm('Are you sure you want to delete this movie?')) return;

  db.collection('movies').doc(docId).delete()
    .then(() => loadMovies())
    .catch(error => {
      movieErrorMsg.textContent = 'Failed to delete movie: ' + error.message;
    });
}

// Dark/light mode toggle logic

// Load saved mode from localStorage or default to light
const savedMode = localStorage.getItem('mode') || 'light';
document.body.classList.toggle('dark-mode', savedMode === 'dark');
updateToggleText(savedMode);

// Toggle mode on button click
modeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  const mode = isDark ? 'dark' : 'light';
  localStorage.setItem('mode', mode);
  updateToggleText(mode);
});

function updateToggleText(mode) {
  modeToggleBtn.textContent = mode === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}
