import login from "./controllers/login.controller.js";
import logout from "./controllers/logout.controller.js";
import execute from "./controllers/execute.controller.js";
import signup from "./controllers/signup.controller.js";
import {verifyToken} from "./utils/utils.js";
import {sequelize} from './models/users.js'
import home from "./routes/routes.js";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use("/api", verifyToken, home);

app.use("/", express.static(path.join(__dirname, "..", "public")));

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "..", "public") });
});


app.post("/signup", signup);

app.post("/login", login);

app.post("/logout", logout);

app.post("/execute", execute);

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

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
