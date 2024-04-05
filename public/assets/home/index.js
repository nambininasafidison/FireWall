const logout = document.querySelector(".logout");

const links = document.querySelectorAll(".link a");
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = link.href
  });
});

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
          // alert(data);
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
