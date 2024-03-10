const express = require("express");
const cors = require("cors");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const path = require("path");
const { exec } = require("child_process");
const session = require("express-session");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = 3000;

const sequelize = new Sequelize("iptables", "firewall", "123qwerty", {
  host: "localhost",
  dialect: "postgres",
});

const noAuthPages = [
  "/index.html",
  "/assets/home/home.html",
  "/assets/signup/signup.html",
];

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

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "..", "public") });
});

app.use("/", express.static(path.join(__dirname, "..", "public")));
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "social",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
  })
);

// app.use(checkSession);

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

  try {
    const user = await createUser(username, password);
    res.status(201).json({ message: "User created", user: user });
  } catch (error) {
    res.status(500).json({ message: "Error to create user", error: error });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await authenticateUser(username, password);
    if (user) {
      req.session.user = user;
      res.status(200).json({ message: "Utilisateur authentifié", user: user });
    } else {
      res
        .status(401)
        .json({ message: "Utilisateur non trouvé ou mot de passe incorrect" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'authentification de l'utilisateur",
      error: error,
    });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la suppression de la session :", err);
      res.status(500).send("Erreur lors de la suppression de la session.");
    } else {
      req.session.user = null;
    }
  });
});

app.post("/execute", (req, res) => {
  const command = req.body.command;

  runCommand(command, res);
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Base de données synchronisée.");
  })
  .catch((error) => {
    console.error(
      "Erreur lors de la synchronisation de la base de données:",
      error
    );
  });

async function createUser(username, password) {
  const user = await User.create({
    username: username,
    password: password,
  });
  console.log("Utilisateur créé :", user);
  return user;
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

async function authenticateUser(username, password) {
  const user = await User.findOne({ where: { username: username } });
  if (!user) {
    console.log("Utilisateur non trouvé.");
    return null;
  }
  const isValidPassword = await user.validPassword(password);
  if (isValidPassword) {
    console.log("Utilisateur authentifié :", user);
    return user;
  } else {
    console.log("Mot de passe incorrect.");
    return null;
  }
}

port = 80;

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});

//santatraherimampionona@gmail.com

// async function checkSession(req, res, next) {
//   const user = req.session.user;
//   const isLoggedIn = user != null;
//   const path = req.path;
//   const isNoAuthPage = noAuthPages.includes(path);
//   if (isLoggedIn && isNoAuthPage) {
//     res.redirect("/assets/list/list.html");
//   } else if (!isLoggedIn && !isNoAuthPage) {
//     res.redirect("/index.html");
//   } else {
//     next();
//   }
// }
