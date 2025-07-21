// ===== Firebase Initialization =====
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

// ===== Admin Settings =====
const adminUIDs = ["q5uV9wc0PaegqtINxIGCrbb6Wsz2"]; // Add more UIDs as needed
let isAdmin = false;

// ===== DOM Elements =====
const authContainer = document.getElementById('auth-container');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const toggleAuth = document.getElementById('toggle-auth');
const authError = document.getElementById('auth-error');
const appContent = document.getElementById('app-content');

const watchlistEl = document.getElementById('watchlist');
const watchedEl = document.getElementById('watched');

const modeToggle = document.getElementById('mode-toggle');
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const logoutBtn = document.getElementById('logout-btn');

let isLogin = true;

// ===== Auth UI Setup =====
toggleAuth.addEventListener('click', e => {
  if (e.target.id === 'toggle-link') {
    e.preventDefault();
    isLogin = !isLogin;
    updateAuthUI();
  }
});

function updateAuthUI() {
  if (isLogin) {
    authTitle.textContent = 'Login';
    authSubmitBtn.textContent = 'Login';
    toggleAuth.innerHTML = `Don't have an account? <a href="#" id="toggle-link">Register here</a>`;
  } else {
    authTitle.textContent = 'Register';
    authSubmitBtn.textContent = 'Register';
    toggleAuth.innerHTML = `Already have an account? <a href="#" id="toggle-link">Login here</a>`;
  }
}

authForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = authForm.email.value;
  const password = authForm.password.value;
  authError.textContent = '';

  if (isLogin) {
    auth.signInWithEmailAndPassword(email, password).catch(err => {
      authError.textContent = err.message;
    });
  } else {
    auth.createUserWithEmailAndPassword(email, password).catch(err => {
      authError.textContent = err.message;
    });
  }
});

// ===== Handle Auth State Changes =====
auth.onAuthStateChanged(user => {
  if (user) {
    isAdmin = adminUIDs.includes(user.uid);

    // Show/hide admin nav link
    const adminNavLink = document.querySelector('[data-page="admin"]');
    if (adminNavLink) {
      adminNavLink.style.display = isAdmin ? 'block' : 'none';
    }

    authContainer.style.display = 'none';
    appContent.style.display = 'block';
    logoutBtn.style.display = 'block';
    hamburger.style.display = 'inline-block';
    showPage('home');
  } else {
    isAdmin = false;
    authContainer.style.display = 'block';
    appContent.style.display = 'none';
    logoutBtn.style.display = 'none';
    hamburger.style.display = 'none';
    closeSidebar();
  }
});

// ===== Logout Button =====
logoutBtn.addEventListener('click', () => {
  auth.signOut();
  closeSidebar();
});

// ===== Movie List Logic =====
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
let watched = JSON.parse(localStorage.getItem('watched')) || [];

function saveLists() {
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  localStorage.setItem('watched', JSON.stringify(watched));
}

function renderLists() {
  watchlistEl.innerHTML = '';
  watchedEl.innerHTML = '';

  watchlist.forEach(title => {
    const li = document.createElement('li');
    li.textContent = title;

    const btnWatched = document.createElement('button');
    btnWatched.textContent = 'Watched';
    btnWatched.onclick = () => {
      markAsWatched(title);
    };

    li.appendChild(btnWatched);
    watchlistEl.appendChild(li);
  });

  watched.forEach(title => {
    const li = document.createElement('li');
    li.textContent = title;

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.classList.add('delete-btn');
    btnDelete.onclick = () => {
      deleteFromWatched(title);
    };

    li.appendChild(btnDelete);
    watchedEl.appendChild(li);
  });
}

function markAsWatched(title) {
  watchlist = watchlist.filter(t => t !== title);
  if (!watched.includes(title)) watched.push(title);
  renderLists();
  saveLists();
}

function deleteFromWatched(title) {
  watched = watched.filter(t => t !== title);
  renderLists();
  saveLists();
}

// ===== Dark Mode =====
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

// ===== Sidebar Toggle =====
hamburger.addEventListener('click', () => {
  sidebar.classList.remove('hidden');
  sidebar.classList.add('show');
  overlay.classList.remove('hidden');
  overlay.classList.add('show');
});

overlay.addEventListener('click', closeSidebar);

function closeSidebar() {
  sidebar.classList.remove('show');
  sidebar.classList.add('hidden');
  overlay.classList.remove('show');
  overlay.classList.add('hidden');
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeSidebar);
});

// ===== Pages =====
const pages = {
  home: document.getElementById('page-home'),
  watchlist: document.getElementById('page-watchlist'),
  watched: document.getElementById('page-watched'),
  admin: document.getElementById('page-admin')
};

function showPage(pageName) {
  if (pageName === 'admin' && !isAdmin) {
    alert("Access denied. Admins only.");
    return;
  }

  Object.keys(pages).forEach(p => {
    pages[p].classList.add('hidden');
  });
  pages[pageName].classList.remove('hidden');
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = e.target.dataset.page;
    showPage(target);
    closeSidebar();
  });
});

// ===== Initial Render =====
renderLists();
updateAuthUI();
