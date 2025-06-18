// ==== Firebase config ====
// Replace these with your Firebase project config:
const firebaseConfig = {
  apiKey: "AIzaSyA3FUbZhG2qA-lsVVpUJR4UEebhJQBIGLI",
  authDomain: "todolist-7c38d.firebaseapp.com",
  projectId: "todolist-7c38d",
  // ... rest of your config
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signInBtn = document.getElementById('sign-in-btn');
const registerBtn = document.getElementById('register-btn');
const errorMsg = document.getElementById('error-msg');

signInBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(error => {
      errorMsg.textContent = error.message;
    });
});

registerBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(error => {
      errorMsg.textContent = error.message;
    });
});

const googleSignInBtn = document.getElementById('google-signin-btn');

googleSignInBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      window.location.href = "index.html";
    })
    .catch(error => {
      errorMsg.textContent = error.message;
    });
});
