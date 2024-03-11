const logout = document.querySelector(".logout");

logout.addEventListener("click", async (event) => {
  event.preventDefault();

  try {
    let res = confirm("Are you sure to log out ?");
    if (res) {
      fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.text())
        .then((data) => {
          alert(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Error:", error);
  }
});