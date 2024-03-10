document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;
    try {
      let res = confirm("Are you sure to register ?");
      let response;
      if (res) {
        response = await fetch("http://localhost:3000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
        });
      }

      let data = await response.text();
      data = JSON.parse(data);
      console.log(data);
      window.location.href = "http://localhost:3000/";
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
