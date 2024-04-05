import { exec } from "child_process";
import { User } from "../models/users.js";

export async function createUser(username, password) {
  const user = await User.create({
    username: username,
    password: password,
  });
  return user;
}

export async function authenticateUser(username, password) {
  const user = await User.findOne({ where: { username: username } });
  if (user && (await user.validPassword(password))) {
    return user;
  }
  return null;
}

export async function runCommand(command, res) {
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

export async function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).send("Un token est requis pour l'authentification");
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Token invalide");
  }
}
