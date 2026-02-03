const API_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(endpoint, method = "GET", body = null, isForm = false) {
  const headers = {};

  if (!isForm) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = "Bearer " + token;

  const options = { method, headers };

  if (body) {
    options.body = isForm ? body : JSON.stringify(body);
  }

  const res = await fetch(API_URL + endpoint, options);
  return res.json();
}
