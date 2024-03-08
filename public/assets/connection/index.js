document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const output = document.getElementById("output");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
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
      output.innerText = data;
    } catch (error) {
        console.error("Error:", error);
    }
  });
});
