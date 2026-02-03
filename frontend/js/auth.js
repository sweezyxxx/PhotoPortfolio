async function register() {
  const data = {
    username: username.value,
    email: email.value,
    password: password.value
  };

  await apiRequest("/auth/register", "POST", data);
  window.location.href = "login.html";
}

async function login() {
  const res = await apiRequest("/auth/login", "POST", {
    email: email.value,
    password: password.value
  });

  localStorage.setItem("token", res.token);
  window.location.href = "index.html";
}
