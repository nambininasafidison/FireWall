const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require('jsonwebtoken'); 

const app = express();
const port = 3000;

const secretKey = 'votre_secret_jwt';

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

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).send('Un token est requis pour l\'authentification');
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Token invalide');
  }
}

app.use('/api', verifyToken);

app.use("/", express.static(path.join(__dirname, "..", "public")));

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "..", "public") });
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
  try {
    const user = await createUser(username, password);
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' }); 
    res.status(201).json({ message: "Utilisateur créé", user: user, token: token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error: error });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await authenticateUser(username, password);
    if (user) {
      const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' }); 
      res.status(200).json({ message: "Utilisateur authentifié", user: user, token: token });
    } else {
      res.status(401).json({ message: "Utilisateur non trouvé ou mot de passe incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'authentification", error: error });
  }
});

app.post("/logout", (req, res) => {
  res.status(200).send("Déconnexion réussie.");
});

app.post("/execute", (req, res) => {
  const command = req.body.command;

  runCommand(command, res);
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Base de données synchronisée.");
  })
  .catch((error) => {
    console.error("Erreur lors de la synchronisation de la base de données:", error);
  });

async function createUser(username, password) {
  const user = await User.create({
    username: username,
    password: password,
  });
  return user;
}

async function authenticateUser(username, password) {
  const user = await User.findOne({ where: { username: username } });
  if (user && await user.validPassword(password)) {
    return user; 
  }
  return null;
}

async function runCommand(command, res) {
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

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
