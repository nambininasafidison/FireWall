const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Initialisation de Sequelize
const sequelize = new Sequelize('nom_de_votre_base_de_donnees', 'votre_utilisateur_postgres', 'votre_mot_de_passe_postgres', {
  host: 'localhost',
  dialect: 'postgres'
});

// Définition du modèle User
const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Méthode pour le chiffrement du mot de passe avant de sauvegarder
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Méthode de vérification du mot de passe
User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Middleware pour parser les données du formulaire
app.use(bodyParser.json());

// Route pour l'inscription (sign-up)
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.create({
      username: username,
      password: password
    });
    console.log("Utilisateur créé :", user);
    res.send('Inscription réussie !');
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    res.status(500).send('Une erreur est survenue lors de l\'inscription.');
  }
});

// Route pour la connexion (log-in)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      res.status(400).send('Utilisateur non trouvé.');
      return;
    }
    const isValidPassword = await user.validPassword(password);
    if (isValidPassword) {
      res.send('Connexion réussie !');
    } else {
      res.status(400).send('Mot de passe incorrect.');
    }
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
    res.status(500).send('Une erreur est survenue lors de la connexion.');
  }
});

// Synchronisation du modèle avec la base de données (force: true pour recréer les tables)
sequelize.sync({ force: true })
  .then(() => {
    console.log('Base de données synchronisée.');
    // Exemple de création d'un utilisateur
    createUser("utilisateur1", "motdepasse123");

    // Exemple d'authentification d'un utilisateur
    authenticateUser("utilisateur1", "motdepasse123");
    authenticateUser("utilisateur1", "motdepasse456");
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
  });

// Fonction pour créer un utilisateur
async function createUser(username, password) {
  try {
    const user = await User.create({
      username: username,
      password: password
    });
    console.log("Utilisateur créé :", user);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
  }
}

// Fonction pour authentifier un utilisateur
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
    console.error("Erreur lors de l'authentification de l'utilisateur :", error);
  }
}

// Serveur écoutant sur le port 3000
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});