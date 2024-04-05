import { authenticateUser } from "../utils/utils.js";
import jwt from "jsonwebtoken";
const secretKey = "secure_iptables";

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await authenticateUser(username, password);
    if (user) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({  user: user, token: token })
    } else {
      res
        .status(401)
        .json({ message: "Utilisateur non trouvé ou mot de passe incorrect" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'authentification", error: error });
  }
}

export default login;
