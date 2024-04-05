document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#loginForm");

  if (!loginForm) {
    console.error("Login form not found.");
    return;
  }

  const usernameInput = document.getElementById("loginUsername");
  const passwordInput = document.getElementById("loginPassword");

  const show = document.querySelector(".btnShow");
  const icon = document.querySelector(".passwdShow");

  if (!usernameInput || !passwordInput || !show || !icon) {
    console.error("Required elements not found.");
    return;
  }

  show.addEventListener("click", (e) => {
    e.preventDefault();
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.style.backgroundImage = 'url("/assets/outils/eye.svg")';
    } else {
      passwordInput.type = "password";
      icon.style.backgroundImage = 'url("/assets/outils/eye-slash.svg")';
    }
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    let res = confirm("Visit home page ?");
    if (!res) {
      return;
    }

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Invalid credentials or server error');
        }
        return response.json();
      })
      .then(data => {
        // console.log('Success:', data);
        window.location.href = "http://localhost:3000/assets/home/home.html";
      })
      .catch((error) => {
        // console.error('Error:', error.message);
        if (error.message === 'Invalid credentials or server error') {
          alert('Invalid credentials. Please try again.');
        } else {
          alert('An error occurred. Please try again later.');
        }
      });
  });
});
