const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');      
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Subject = require('../models/Subject');
const Session = require('../models/Session');
const verificaToken = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
  const { username, parola } = req.body;

  try {
    const utilizatorExistent = await User.findOne({ username });
    if (utilizatorExistent) {
      return res.status(400).json({ error: "Acest nume de utilizator este deja luat!" });
    }

    const salt = await bcrypt.genSalt(10);
    const parolaCriptata = await bcrypt.hash(parola, salt);

    const utilizatorNou = new User({
      username: username,
      parola: parolaCriptata
    });

    await utilizatorNou.save();
    res.status(201).json({ mesaj: "Cont creat cu succes!" });
  } catch (err) {
    console.error("Eroare la inregistrare:", err);
    res.status(500).json({ error: "Eroare la crearea contului." });
  }
});

router.post('/login', async (req, res) => {
  const { username, parola } = req.body;

  try {
    const utilizator = await User.findOne({ username });
    if (!utilizator) {
      return res.status(400).json({ error: "Utilizator sau parola incorecta!" });
    }

    const parolaE_Buna = await bcrypt.compare(parola, utilizator.parola);
    if (!parolaE_Buna) {
      return res.status(400).json({ error: "Utilizator sau parola incorecta!" });
    }

    const CHEIE_SECRETA = process.env.CHEIE_SECRETA;
    const token = jwt.sign(
      { id: utilizator._id, username: utilizator.username }, 
      CHEIE_SECRETA, 
      { expiresIn: "24h" } 
    );

    res.json({ mesaj: "Te-ai logat cu succes!", token: token, username: utilizator.username });
  } catch (err) {
    console.error("Eroare la login:", err);
    res.status(500).json({ error: "Eroare la logare." });
  }
});

router.delete('/user', verificaToken, async (req, res) => {
  console.log("--- INCERCARE STERGERE CONT ---");
  console.log("ID Utilizator din Token:", req.user.id);

  try {
    const userId = req.user.id;

    const sesiuniSterse = await Session.deleteMany({ user_id: userId });
    console.log(`Sesiuni sterse: ${sesiuniSterse.deletedCount}`);

    const materiiSterse = await Subject.deleteMany({ user_id: userId });
    console.log(`Materii sterse: ${materiiSterse.deletedCount}`);

    const utilizatorSters = await User.findByIdAndDelete(userId);
    
    if (!utilizatorSters) {
      console.log("EROARE: Utilizatorul nu a fost gasit in DB!");
      return res.status(404).json({ error: "Utilizatorul nu a fost gasit." });
    }

    console.log("SUCCES: Contul a fost sters definitiv!");
    res.json({ mesaj: "Cont sters cu succes!" });
  } catch (err) {
    console.error("Eroare la stergere:", err);
    res.status(500).json({ error: "Eroare interna la server." });
  }
});

module.exports = router;
