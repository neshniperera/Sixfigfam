  // Import Firebase
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyABnXX7RGTnX_TSmclfmqyfYCNc6DSxQi8",
  authDomain: "figfam-3c952.firebaseapp.com",
  projectId: "figfam-3c952",
  storageBucket: "figfam-3c952.firebasestorage.app",
  messagingSenderId: "875036927097",
  appId: "1:875036927097:web:c7ee56d43a3192ec5360a8",
  measurementId: "G-5M2C4Y71MS"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Sign Up
  window.handleSignUp = async (event) => {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showSuccessMessage(`Welcome, ${name}!`);
      closeAuthModal();
      // Redirect to the onboarding page with the user's name
      window.location.href = `onboarding.html?name=${encodeURIComponent(name)}`;
    } catch (error) {
      alert(error.message);
    }
  };

  // Sign In
  window.handleSignIn = async (event) => {
    event.preventDefault();
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showSuccessMessage(`Signed in as ${email}`);
      closeAuthModal();
      // Redirect to the onboarding page (you might want to retrieve the name here)
      window.location.href = "onboarding.html?name=Friend"; // Replace "Friend" with a dynamic name if available
    } catch (error) {
      alert(error.message);
    }
  };

  // Google Sign-In
  window.handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Get the user object from the result
      showSuccessMessage(`Signed in with Google!`);
      closeAuthModal();

      // Redirect to the onboarding page with the user's name from Google
      window.location.href = `onboarding.html?name=${encodeURIComponent(user.displayName)}`;
    } catch (error) {
      alert(error.message);
    }
  };

  // Sign Out
  window.handleSignOut = async () => {
    await signOut(auth);
    showSuccessMessage("Signed out successfully!");
  };