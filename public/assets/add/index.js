let port = document.querySelector("#agree");
let multi = document.querySelector(".multi");
const add = document.querySelector("#add");
const reset = document.querySelector(".cancel");
const save = document.querySelector("#save");
const iface = document.querySelector("#interface");
const mac = document.getElementById("mac");

const linkHome = document.querySelector(".sign a");
linkHome.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/assets/home/home.html";
});

mac.addEventListener("input", (e) => {
  var regex = /^([0-9A-Fa-f]{2}[:-]){0,5}([0-9A-Fa-f]{0,2})$/;
  var valid = regex.test(e.target.value);
  var parts = e.target.value.split(/[:-]/);

  if (!valid || parts.some(part => part.length > 2)) {
    e.target.value = e.target.value.substring(0, e.target.value.length - 1);
  }
});


iface.addEventListener("change", () => {
  const ioface = document.querySelector(".ioface");
  const sign = document.querySelector(".sign");
  if (iface.value == "none") {
    ioface.style.display = "none";
    sign.style.marginTop = "3vh";
  } else {
    ioface.style.display = "block";
    sign.style.marginTop = "1vh";
  }
});

reset.addEventListener("click", (e) => {
  // e.preventDefault();
  const res = confirm("Do you want reset all ?");
  if (res) {
    location.reload();
  }
});

add.addEventListener("click", (e) => {
  e.preventDefault();
  const res = confirm("Do you want to continue ?");
  if (res) {
    sendCommand();
  }
});

port.addEventListener("change", () => {
  multi.style.display = port.checked ? "block" : "none";
});

save.addEventListener("click", () => {
  multi.style.display = "none";
});

const subs = document.querySelector(".submitPorts");
subs.addEventListener("click", () => {
  const n = document.querySelector("#ports").value;
  const form = document.createElement("form");
  const container = document.querySelector(".container");
  // console.log(document.querySelector("#ports").max);
  if (n <= +document.querySelector("#ports").max) {
    for (let i = 1; i <= n; i++) {
      const input = document.createElement("input");
      input.type = "number";
      input.id = "input" + i;
      input.min = 1;
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

async function sendCommand() {
  const policy = "-A " + document.querySelector("#policy").value + " ";
  const sense =
    "-j " + document.querySelector("#sense").value.toUpperCase() + " ";
  let allPort = "";
  const protocol =
    document.querySelector("#protocol").value == "none"
      ? ""
      : "-p " + document.querySelector("#protocol").value + " ";
  if (port.checked) {
    const n = document.querySelector("#ports").value;
    for (let i = 1; i <= n; i++) {
      const input = document.querySelector("#input" + i).value;
      allPort += i != 1 ? "," + input : input;
    }
  }

  const inter = document.querySelector("#interface");
  let ifaces = "";
  if (inter.value != "") {
    ifaces += document.querySelector("#in").checked
      ? ifaces + "-i " + inter.value + " "
      : document.querySelector("#out").checked
      ? ifaces + "-o " + inter.value + " "
      : "";
  }

  let control =
    document.querySelector("#policy").value == "input"
      ? "--sports "
      : document.querySelector("#policy").value == "output"
      ? "--dports "
      : "--dports ";
  console.log(document.querySelector("#policy").value);

  console.log("=>", control);

  const cmdPorts = port.checked
    ? "-m multiport " + control + allPort + " "
    : " ";
  const cmdPort =
    document.querySelector("#port").value != ""
      ? control + document.querySelector("#port").value + " "
      : "";
  const Mac = document.querySelector("#mac").value;
  const mac = Mac != "" ? "-m mac --mac-source " + Mac + " " : "";
  const Source = document.querySelector("#source").value;
  const source = Source != "" ? "-s " + Source + " " : "";
  const Destination = document.querySelector("#destination").value;
  const destination = Destination != "" ? "-d " + Destination + " " : "";
  const cport =
    document.querySelector("#protocol").value != "none" ? cmdPort : "";
  const cports =
    document.querySelector("#protocol").value != "none" ? cmdPorts : "";
  const commandePort = port.checked ? cports : cport;
  console.log(cport);
  const commandInput =
    "sudo iptables " +
    policy.toUpperCase() +
    sense +
    protocol +
    commandePort +
    mac +
    source +
    destination;
  console.log(commandInput);
  fetch("/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: commandInput }),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      // location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
