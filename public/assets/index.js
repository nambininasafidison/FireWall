document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      let res = confirm("Visit home page ?");
      let response;
      if (res) {
        response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
        });
        if (!response.ok) {
          throw new Error("Erreur de connexion.");
        }
      }


      let data = await response.text();
      console.log(data);
      window.location.href = "/assets/home/home.html";
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
