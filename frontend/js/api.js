const API_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function isLoggedIn() {
  return !!getToken();
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

async function apiRequest(endpoint, method = "GET", body = null, isForm = false) {
  const token = getToken();
  const headers = {};

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  // ВАЖНО: Content-Type НЕ ставим для FormData
  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(API_URL + endpoint, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : null
  });

  return res.json();
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

function renderNav() {
  const navAuth = document.getElementById("nav-auth");
  if (!navAuth) return;

  const user = getUser();

  if (user) {
    navAuth.innerHTML = `
      <span>Hello, <strong>${user.username}</strong></span>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    navAuth.innerHTML = `<a href="login.html">Login</a>`;
  }
}


function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

