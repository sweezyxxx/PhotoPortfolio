/* =======================
   API CONFIG
======================= */

// Dynamically determine API URL
const API_URL = window.location.hostname === 'localhost'
  ? "http://localhost:5000/api"
  : "/api";



/* =======================
   AUTH TOKEN HELPERS
======================= */

function getToken() {
  return localStorage.getItem("token");
}

function isLoggedIn() {
  return !!getToken();
}


/* =======================
   USER SESSION ACTIONS
======================= */

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "index.html";
}


/* =======================
   CORE API REQUEST
======================= */

function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  isForm = false
) {
  const token = localStorage.getItem("token");

  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(API_URL + endpoint, {
    method,
    headers,
    body: isForm
      ? body
      : body
        ? JSON.stringify(body)
        : null,
  }).then(res => res.json());
}


/* =======================
   AUTH GUARDS
======================= */

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}


/* =======================
   NAVBAR RENDERING
======================= */

function renderNav() {
  const navAuth = document.getElementById("nav-auth");
  if (!navAuth) return;

  const user = getUser();

  /* ===== Remove protected links ===== */

  if (!user) {
    document.getElementById("nav-upload")?.remove();
    document.getElementById("nav-stats")?.remove();
  }

  /* ===== Auth state UI ===== */

  if (user) {
    navAuth.innerHTML = `
      <span>
        Hello, <strong>${user.username}</strong>
      </span>
      <a href="profile.html">Profile</a>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="login.html">Login</a>
    `;
  }
}



/* =======================
   USER DATA ACCESS
======================= */

function getUser() {
  const user = localStorage.getItem("user");

  return user
    ? JSON.parse(user)
    : null;
}