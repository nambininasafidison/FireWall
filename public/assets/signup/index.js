const signupForm = document.querySelector(".submit");
const username = document.getElementById("signupUsername").value;
const password = document.getElementById("signupPassword").value;
const passwd = document.getElementById("signupPassword");

const show = document.querySelector(".btnShow");
const icon = document.querySelector(".passwdShow");

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

signupForm.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    let res = confirm("Are you sure to register ?");
    if (res) {
      fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      window.location.href = "http://localhost:3000/";
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
