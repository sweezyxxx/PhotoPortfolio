function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  }
}

async function login() {
  const res = await apiRequest("/auth/login", "POST", {
    login: loginInput.value,
    password: password.value
  });

  if (!res.success) {
    showError(res.message || "Login failed");
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
    showError(res.message || "Register failed");
    return;
  }

  window.location.href = "login.html";
}
