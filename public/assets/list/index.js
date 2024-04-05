let results = {};
const delAll = document.querySelector(".delall");
delAll.addEventListener("click", () => {
  const res = confirm("Are you sure to delete all exist rules ?");
  if (res) {
    sendCommand("sudo iptables -F");
    alert("All rules deleted.");
    location.reload();
  }
});

window.onload = async () => {
  results = await sendCommand("sudo iptables -L");
  createTable(results);
};

defaultPolicy();

async function defaultPolicy() {
  const sense = document.querySelector("#sense");
  const dpolicy = document.querySelector("#policy");
  sense.addEventListener("change", () => {
    const chain = dpolicy.value;
    const res = confirm("Do you want to change chain policy ?");
    if (res) {
      sendCommand("sudo iptables -P " + chain + " " + sense.value);
      alert("Chain changed.");
      location.reload();
    }
  });
}

async function rm(chain, del) {
  const no = del.getAttribute("id").split("d")[1];
  const res = confirm("Are you sure to delete this rule ?");
  if (res) {
    removeRule(chain, no);
  }
}

function updateContent(all) {
  return function () {
    let modCmd = Array.from(all).map((input) => input.value);
    let policy = document.querySelector("#policy").value;
    policy = policy.toUpperCase();
    const no = modCmd[0];
    const target = " -j " + modCmd[1] + " ";
    const prot = modCmd[2] !== "all" ? "-p " + modCmd[2] + " " : "";
    const source = modCmd[3] !== "anywhere" ? "-s " + modCmd[3] + " " : "";
    const dest = modCmd[4] !== "anywhere" ? "-d " + modCmd[4] + " " : "";
    const cmd =
      "sudo iptables -R " + policy + " " + no + target + prot + source + dest;

    return cmd;
  };
}

async function makeRead(all, bool) {
  all.forEach((item) => {
    item.readOnly = bool;
    item.removeEventListener("input", updateContent(all));
    item.addEventListener("input", updateContent(all));
  });
}

async function mv(valid, cancel, options, del, modif) {
  const no = del.getAttribute("id").split("d")[1];
  const all = document.querySelectorAll(".modifiable" + no);
  let modCmd = "";

  await makeRead(all, false);

  const res = confirm("Do you want to modify this rule?");
  if (res) {
    modCmd = updateContent(all)();

    del.remove();
    modif.remove();
    options.appendChild(valid);
    options.appendChild(cancel);
    console.log(modCmd);
    valid.addEventListener("click", async () => {
      const response = confirm("Submit this change?");
      if (response) {
        await makeRead(all, true);
        modifyRule(modCmd, options, valid, cancel, del, modif);
      }
    });
  }
}


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

function modifyRule(cmd, options, valid, cancel, nodel, mod) {
  const removeCmd = cmd;

  fetch("/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ command: removeCmd }),
  })
    .then((response) => {
      if (response.ok) {
        valid.remove();
        cancel.remove();
        options.appendChild(mod);
        options.appendChild(nodel);
        alert("Rule modified");
        location.reload();
      } else {
        alert("An error occured");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function createInput(input, i) {
  input.type = "text";
  input.readOnly = true;
  input.classList.add("modifiable" + i);
}

async function createTable(results) {
  const tbody = document.querySelector("tbody");
  const policy = document.querySelector("#policy");
  policy.addEventListener("change", () => {
    tbody.innerHTML = "";
    const chain = policy.value;
    let i = 1;
    if (results[chain]) {
      results[chain].map((item) => {
        const tr = document.createElement("tr");
        const number = document.createElement("td");
        number.classList.add("number");
        const inPutN = document.createElement("input");
        createInput(inPutN, i);
        inPutN.value = i;
        number.appendChild(inPutN);

        const target = document.createElement("td");
        const inPutT = document.createElement("input");
        createInput(inPutT, i);
        inPutT.value = item.target;
        target.appendChild(inPutT);

        const prot = document.createElement("td");
        const inPutP = document.createElement("input");
        createInput(inPutP, i);
        inPutP.value = item.protocol;
        prot.appendChild(inPutP);

        const source = document.createElement("td");
        const inPutS = document.createElement("input");
        createInput(inPutS, i);
        inPutS.value = item.in;
        source.appendChild(inPutS);

        const destination = document.createElement("td");

        const inPutD = document.createElement("input");
        createInput(inPutD, i);
        inPutD.value = item.out;
        destination.appendChild(inPutD);

        const others = document.createElement("td");
        others.classList.add("others");
        const showButton = document.createElement("button");
        showButton.classList.add("showButton");

        const divcontainer = document.createElement("div");
        const showImg = document.createElement("div");
        const containerOthers = document.createElement("div");
        showImg.classList.add("showImg");
        showButton.appendChild(showImg);

        const inPutOt = document.createElement("input");
        createInput(inPutOt, i);
        inPutOt.value = item.others;

        containerOthers.classList.add("containerOthers");
        const showExit = document.createElement("button");
        divcontainer.classList.add("divcontainer");
        showExit.classList.add("showExit");
        showExit.innerText = "X";
        divcontainer.appendChild(inPutOt);
        divcontainer.appendChild(showExit);
        containerOthers.appendChild(divcontainer);

        showButton.addEventListener("click", () => {
          showButton.style.display = "none";
          containerOthers.style.display = "block";
        });

        showExit.addEventListener("click", () => {
          containerOthers.style.display = "none";
          showButton.style.display = "block";
        });

        others.appendChild(showButton);
        others.appendChild(containerOthers);

        const options = document.createElement("td");
        options.classList.add("action");

        const valid = document.createElement("button");
        valid.classList.add("valid");
        valid.setAttribute("id", "b" + i);

        const Valid = document.createElement("div");
        Valid.classList.add("Valid");
        valid.appendChild(Valid);
        valid.style.backgroundColor = "#0f0";

        const cancel = document.createElement("button");
        cancel.classList.add("cancel");
        cancel.setAttribute("id", "b" + i);

        const Cancel = document.createElement("div");
        Cancel.classList.add("Cancel");
        cancel.appendChild(Cancel);
        cancel.style.backgroundColor = "#f00";
        cancel.addEventListener("click", () => {
          const res = confirm("Abandon modification ?");
          if (res) {
            location.reload();
          }
        });

        const modif = document.createElement("button");
        const del = document.createElement("button");
        modif.classList.add("modif");
        modif.addEventListener("click", () => {
          mv(valid, cancel, options, del, modif);
        });

        const modifImg = document.createElement("div");
        modifImg.classList.add("modifImg");
        modif.appendChild(modifImg);
        options.appendChild(modif);

        del.classList.add("delete");
        del.setAttribute("id", "d" + i);
        del.addEventListener("click", () => {
          rm(chain, del);
        });

        const trash = document.createElement("div");
        trash.classList.add("trash");
        del.appendChild(trash);
        options.appendChild(del);

        tr.appendChild(number);
        tr.appendChild(target);
        tr.appendChild(prot);
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

async function sendCommand(commandInput) {
  // const commandInput = "sudo iptables -L";
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
