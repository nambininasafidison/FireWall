let results = {};

window.onload = async () => {
  results = await sendCommand();
  createTable(results);
};

function removeRule(chain, number) {
  const removeCmd = "sudo iptables -D " + chain + " " + number;

  fetch("/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: removeCmd }),
  })
    .then((response) => response.text())
    .then((data) => {
      alert("Rule deleted");
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function modifyRule(number) {
  const removeCmd = "sudo iptables -R ";

  fetch("/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: removeCmd }),
  })
    .then((response) => response.text())
    .then((data) => {
      alert("Rule deleted");
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function createTable(results) {
  const tbody = document.querySelector("tbody");
  const select = document.querySelector("select");
  select.addEventListener("change", () => {
    tbody.innerHTML = "";
    const chain = select.value;
    let i = 1;
    if (results[chain]) {
      results[chain].map((item) => {
        const tr = document.createElement("tr");
        const number = document.createElement("td");
        number.innerText = i;

        const target = document.createElement("td");
        target.innerText = item.target;

        const prot = document.createElement("td");
        prot.innerText = item.protocol;

        const opt = document.createElement("td");
        opt.innerText = item.opt;

        const source = document.createElement("td");
        source.innerText = item.in;

        const destination = document.createElement("td");
        destination.innerText = item.out;

        const others = document.createElement("td");
        others.classList.add("others");
        others.innerText = item.others;

        const options = document.createElement("td");
        options.classList.add("action");

        const modif = document.createElement("button");
        modif.classList.add("modif");
        modif.addEventListener("click", () => {
          const res = confirm("Do you want to modify this rule ?");
          if (res) {
          }
        });
        const modifImg = document.createElement("div");
        modifImg.classList.add("modifImg");
        modif.appendChild(modifImg);
        options.appendChild(modif);

        const del = document.createElement("button");
        del.classList.add("delete");
        del.addEventListener("click", (number) => {
          const res = confirm("Are you sure to delete this rule ?");
          console.log(chain, i);
          if (res) {
            removeRule(chain, i - 1);
          }
        });
        const trash = document.createElement("div");
        trash.classList.add("trash");
        del.appendChild(trash);
        options.appendChild(del);

        tr.appendChild(number);
        tr.appendChild(target);
        tr.appendChild(prot);
        tr.appendChild(opt);
        tr.appendChild(source);
        tr.appendChild(destination);
        tr.appendChild(others);
        tr.appendChild(options);
        tbody.appendChild(tr);
        i++;
      });
    }
  });
}

function sendCommand() {
  const commandInput = "sudo iptables -L";
  let result = {};

  fetch("/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: commandInput }),
  })
    .then((response) => response.text())
    .then((data) => {
      let lines = data.split("\n");
      let currentChain = "";
      for (let line of lines) {
        if (line.startsWith("Chain")) {
          let chainName = line.split(" ")[1];
          result[chainName] = [];
          currentChain = chainName;
        } else if (
          line.startsWith("ACCEPT") ||
          line.startsWith("DROP") ||
          line.startsWith("REJECT")
        ) {
          let fields = line.split(/\s+/);
          let other = "";
          for (let i = 5; i < fields.length; i++) {
            other += " " + fields[i];
          }
          other = other.trim();
          let rule = {
            target: fields[0],
            protocol: fields[1],
            opt: fields[2],
            in: fields[3],
            out: fields[4],
            others: other,
          };
          result[currentChain].push(rule);
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return result;
}
