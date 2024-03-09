let port = document.querySelector("#agree");
port.addEventListener("change", () => {
  port.checked
    ? (document.querySelector(".multi").style.display = "block")
    : (document.querySelector(".mutli").style.display = "none");
});

const subs = document.querySelector(".submitPorts");
subs.addEventListener("click", () => {
  const n = document.querySelector("#ports").value;
  console.log(n);
  const form = document.createElement("form");
  const container = document.querySelector(".container");
  if (n <= document.querySelector("#ports").max) {
    for (let i = 1; i <= n; i++) {
      const input = document.createElement("input");
      input.type = "number";
      input.id = "input" + i;
      form.appendChild(input);
    }
    container.appendChild(form);
  } else {
    const res = document.createElement("p");
    res.innerText = "Your number is beyond the maximum";
    res.style.color = "#f00";
    container.appendChild(res);
  }
});

function sendCommand() {
  const commandInput = document.getElementById("commandInput").value;

  fetch("/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: commandInput }),
  })
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("output").innerText = data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
