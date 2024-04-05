import {createUser} from "../utils/utils.js";
import jwt from "jsonwebtoken";
const secretKey = "secure_iptables";

async function signup(req, res) {
  const { username, password } = req.body;
  try {
    const user = await createUser(username, password);
    const token = jwt.sign(
      { id: user.id, username: user.username },
      secretKey,
      { expiresIn: "1h" }
    );
    res
      .status(201)
      .json({ message: "Utilisateur créé", user: user, token: token });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error,
    });
  }
}

export default signup;
