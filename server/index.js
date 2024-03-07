const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors);
app.use(express.json());

const sequelize = new Sequelize("iptables", "firewall", "123qwerty", {
  host: "localhost",
  dialect: "postgres",
});

const User = sequelize.define("user", {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  createUser(username, password);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  authenticateUser(username, password);
});

app.post("/execute", (req, res) => {
  const command = req.body.command;

  runCommand(command, res);
});

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Base de données synchronisée.");
    // createUser("utilisateur1", "motdepasse123");

    // authenticateUser("utilisateur1", "motdepasse123");
    // authenticateUser("utilisateur1", "motdepasse456");
  })
  .catch((error) => {
    console.error(
      "Erreur lors de la synchronisation de la base de données:",
      error
    );
  });

async function createUser(username, password) {
  try {
    const user = await User.create({
      username: username,
      password: password,
    });
    console.log("Utilisateur créé :", user);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
  }
}

async function runCommand(command, res){
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      res.status(500).send(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Command error: ${stderr}`);
      res.status(500).send(`Command error: ${stderr}`);
      return;
    }
    console.log(`Command executed: ${command}`);
    console.log(`Command output:\n${stdout}`);
    res.send(stdout);
  });
}

async function authenticateUser(username, password) {
  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      console.log("Utilisateur non trouvé.");
      return;
    }
    const isValidPassword = await user.validPassword(password);
    if (isValidPassword) {
      console.log("Utilisateur authentifié :", user);
    } else {
      console.log("Mot de passe incorrect.");
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'authentification de l'utilisateur :",
      error
    );
  }
}

const server = http.createServer(app);

server.listen(port, "localhost",  () => {
  console.log(`Serveur en écoute sur le port localhost:${port}`);
});
