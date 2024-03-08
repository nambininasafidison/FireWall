document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.text();
      // data = JSON.parse(data);
      // console.log(data);
      // document.getElementById("output").innerText = data.message;
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
