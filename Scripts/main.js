// Global variables
let currentUser = null;

// Modal functions
function openAuthModal() {
  document.getElementById('authModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Tab switching
function switchTab(tab) {
  // Remove active class from all tabs and forms
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  
  // Add active class to selected tab and form
  document.querySelector(`.auth-tab:nth-child(${tab === 'signin' ? 1 : 2})`).classList.add('active');
  document.getElementById(`${tab}Form`).classList.add('active');
}

// Show success message
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10B981;
      color: white;
      padding: 15px 25px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
      z-index: 3000;
      font-family: 'Quicksand', sans-serif;
      font-weight: 600;
      animation: slideInRight 0.5s ease-out;
  `;
  successDiv.textContent = message;
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
      successDiv.remove();
  }, 5000);
}

// Handle forgot password
function handleForgotPassword() {
  const email = prompt('Please enter your email address:');
  if (email) {
      alert('Password reset instructions have been sent to your email.');
  }
}

// Initialize Google Sign-In
function initializeGoogleSignIn() {
  if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
          client_id: '830324941217-pu3jr5sfkdf05du9b9hrbiljjlokcp52.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse
      });
  }
}

// Handle Google Sign-In response
function handleGoogleCredentialResponse(response) {
  // Decode the JWT token
  const userInfo = parseJwt(response.credential);
  
  // Store user information
  currentUser = {
      id: userInfo.sub,
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture
  };
  
  // Close modal and show success message
  closeAuthModal();
  showSuccessMessage(`Welcome, ${currentUser.name}! You've successfully signed in.`);
}

// Parse JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

// Animation and intersection observers
document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for animations
  const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.style.animationPlayState = 'running';
          }
      });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.feature-card, [style*="slideInUp"], .about-content h2, .about-content p').forEach(el => {
      observer.observe(el);
  });

  // Parallax effect for floating elements
  window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.floating-element');
      
      parallaxElements.forEach((element, index) => {
          const speed = 0.5 + (index * 0.1);
          element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
      });
  });
  
  // Initialize Google Sign-In
  if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
  } else {
      // Retry initialization after a delay if Google API isn't loaded yet
      setTimeout(initializeGoogleSignIn, 1000);
  }
  
  // Close modal when clicking outside
  document.getElementById('authModal').addEventListener('click', function(e) {
      if (e.target === this) {
          closeAuthModal();
      }
  });
  
  // Handle contact form submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const name = document.getElementById('contactName').value;
          const email = document.getElementById('contactEmail').value;
          
          // Here you would typically send the form data to your server
          console.log('Contact form submitted:', { name, email });
          
          // Show success message
          showSuccessMessage('Message sent successfully! We\'ll get back to you soon.');
          
          // Reset form
          contactForm.reset();
      });
  }

  // Add slideInRight animation if not already defined
  const styleExists = document.querySelector('style[data-name="slideInRight"]');
  if (!styleExists) {
      const style = document.createElement('style');
      style.dataset.name = "slideInRight";
      style.textContent = `
          @keyframes slideInRight {
              from {
                  opacity: 0;
                  transform: translateX(300px);
              }
              to {
                  opacity: 1;
                  transform: translateX(0);
              }
          }
      `;
      document.head.appendChild(style);
  }
});

// Handle Google Sign-Up (same as sign in for Google)
function handleGoogleSignUp() {
  window.google.accounts.id.prompt();
}