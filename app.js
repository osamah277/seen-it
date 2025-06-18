document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("sign-in");
  const signOutBtn = document.getElementById("sign-out");
  const modeToggle = document.getElementById("mode-toggle");
  const addBtn = document.getElementById("add-button");
  const movieInput = document.getElementById("movie-title");
  const watchlist = document.getElementById("watchlist");
  const watchedlist = document.getElementById("watchedlist");

  let userId = null;

  // Light/Dark Mode
  modeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // Auth
  signInBtn.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  });

  signOutBtn.addEventListener("click", () => auth.signOut());

  auth.onAuthStateChanged(user => {
    if (user) {
      userId = user.uid;
      signInBtn.style.display = "none";
      signOutBtn.style.display = "inline-block";
      loadMovies();
    } else {
      userId = null;
      signInBtn.style.display = "inline-block";
      signOutBtn.style.display = "none";
      watchlist.innerHTML = "";
      watchedlist.innerHTML = "";
    }
  });

  // Add movie
  addBtn.addEventListener("click", () => {
    const title = movieInput.value.trim();
    if (!title || !userId) return;
    db.collection("users").doc(userId).collection("movies").add({
      title,
      watched: false
    });
    movieInput.value = "";
    loadMovies();
  });

  // Load movies
  function loadMovies() {
    if (!userId) return;
    db.collection("users").doc(userId).collection("movies").get().then(snapshot => {
      watchlist.innerHTML = "";
      watchedlist.innerHTML = "";
      snapshot.forEach(doc => {
        const movie = doc.data();
        const li = document.createElement("li");
        li.textContent = movie.title;
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = movie.watched ? "Unwatch" : "Watched";
        toggleBtn.addEventListener("click", () => {
          db.collection("users").doc(userId).collection("movies").doc(doc.id).update({
            watched: !movie.watched
          }).then(loadMovies);
        });
        li.appendChild(toggleBtn);
        if (movie.watched) watchedlist.appendChild(li);
        else watchlist.appendChild(li);
      });
    });
  }
});
