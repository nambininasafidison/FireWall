document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const output = document.getElementById("output");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (!response.ok) {
        throw new Error("Erreur de connexion.");
      }

      const data = await response.text();
      console.log(data);
      output.textContent = data;
      window.location.href = "/home";
    } catch (error) {
      output.textContent = error.message;
    }
  });
});
