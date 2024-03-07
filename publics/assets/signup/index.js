document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const output = document.getElementById("output");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;
    console.log(username);
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      console.log(password);
      const data = await response.text();
      console.log(data);
      output.textContent = data;
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
