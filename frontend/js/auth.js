async function login() {
  const res = await apiRequest("/auth/login", "POST", {
    login: loginInput.value,
    password: password.value
  });

  if (!res.success) {
    alert("Login failed");
    return;
  }

  localStorage.setItem("token", res.token);
  localStorage.setItem("user", JSON.stringify(res.user));

  window.location.href = "index.html";
}


async function register() {
  const res = await apiRequest("/auth/register", "POST", {
    username: username.value,
    email: email.value,
    password: password.value
  });

  if (!res.success) {
    alert("Register failed");
    return;
  }

  window.location.href = "login.html";
}
