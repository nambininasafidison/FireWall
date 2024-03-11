let port = document.querySelector("#agree");
let multi = document.querySelector(".multi");
const add = document.querySelector("#add");
const reset = document.querySelector(".cancel");
const save = document.querySelector("#save");
const iface = document.querySelector("#interface");

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

reset.addEventListener("click", () => {
  e.preventDefault();
  const res = confirm("Do you want reset all ?");
  if (res) {
  }
});

add.addEventListener("submit", (e) => {
  // e.preventDefault();
  const res = confirm("Do you want to continue ?");
  // if (res) {
  //   sendCommand();
  // }
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
  console.log(document.querySelector("#ports").max);
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

function sendCommand() {
  let commandInput = "sudo iptables -L";
  const policy = "-A " + document.querySelector("#policy").value + " ";
  const sense = "-j " + document.querySelector("#sense").value + " ";
  const protocol =
    document.querySelector("#protocol").value == "none"
      ? " "
      : "-p " + document.querySelector("#protocol").value + " ";

  if (port.checked) {
    const n = document.querySelector("#ports").value;
    const allPort = "";
    for (let i = 1; i <= n; i++) {
      const input = document.querySelector("#input" + i).value;
      allPort += i != 1 ? "," + input : input;
    }
  }

  const inter = document.querySelector("#interface");
  const ifaces = " ";
  if (inter.value != none)  {
    ifaces = document.querySelector("#in").checked
      ? ifaces + "-i " + inter.value + " "
      : document.querySelector("#out").checked
      ? ifaces + "-o " + inter.value + " "
      : " ";
  }

  let control =
    document.querySelector("policy").value == "INPUT"
      ? "--sports "
      : document.querySelector("policy").value == "OUTPUT"
      ? "--dports "
      : " ";

  let control1 =
    document.querySelector("policy").value == "INPUT"
      ? "--sport "
      : document.querySelector("policy").value == "OUTPUT"
      ? "--dport "
      : " ";

  const cmdPort = port.checked
    ? "-m multi-port " + control + allPort + " "
    : control1 + document.querySelector("#port").value + " ";
    
  const Mac = document.querySelector("#mac").value;
  const mac = Mac != null ? "-m mac --mac-source " + Mac : " ";
  const Source = document.querySelector("#source").value;
  const source = Mac != null ? "-s " + Source : " ";
  const Destination = document.querySelector("#destination").value;
  const destination = Mac != null ? "-d " + Destination : " ";

  // commandInput = 'sudo iptables '+policy+sense+protocol+cmdPort+mac+source+destination;

  fetch("/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: commandInput }),
  })
    .then((response) => response.text())
    .then((data) => {
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
