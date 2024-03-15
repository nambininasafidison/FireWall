document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector("#signupForm");

  if (!signupForm) {
    console.error("Signup form not found.");
    return;
  }

  const usernameInput = document.getElementById("signupUsername");
  const passwordInput = document.getElementById("signupPassword");
  const passwd = document.getElementById("signupPassword");
  const show = document.querySelector(".btnShow");
  const icon = document.querySelector(".passwdShow");

  if (!usernameInput || !passwordInput || !show || !icon) {
    console.error("Required elements not found.");
    return;
  }

  show.addEventListener("click", (e) => {
    e.preventDefault();
    if (passwd.type === "password") {
      passwd.type = "text";
      icon.style.backgroundImage = 'url("/assets/outils/eye-slash.svg")';
    } else {
      passwd.type = "password";
      icon.style.backgroundImage = 'url("/assets/outils/eye.svg")';
    }
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
      let res = confirm("Are you sure you want to register?");
      if (res) {
        const response = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          window.location.href = "http://localhost:3000/";
        } else {
          console.error("Server error:", response.statusText);
          alert("An error occurred during registration.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

