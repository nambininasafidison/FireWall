const loginForm = document.querySelector(".submit");
const username = document.getElementById("loginUsername").value;
const password = document.getElementById("loginPassword").value;
const passwd = document.getElementById("loginPassword");

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


loginForm.addEventListener("click", () => {
  try {
    let res = confirm("Visit home page ?");
    let response;
    if (res) {
      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (!response.ok) {
        throw new Error("Erreur de connexion.");
      }

      window.location.href = "/assets/home/home.html";
    }
  } catch (error) {
    alert("Password or username incorrect");
    console.error("Error:", error);
  }
});
