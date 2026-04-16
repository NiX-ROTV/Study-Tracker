const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');      
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require('../models/User');
const Subject = require('../models/Subject');
const Session = require('../models/Session');
const verificaToken = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
  const { email, parola } = req.body;

  try {
    const utilizatorExistent = await User.findOne({ email });
    if (utilizatorExistent) {
      return res.status(400).json({ error: "Acest email este deja folosit!" });
    }

    const salt = await bcrypt.genSalt(10);
    const parolaCriptata = await bcrypt.hash(parola, salt);

    const utilizatorNou = new User({
      email,
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
  const { email, parola } = req.body;

  try {
    const utilizator = await User.findOne({ email });
    if (!utilizator) {
      return res.status(400).json({ error: "Email sau parolă incorectă!" });
    }

    const parolaE_Buna = await bcrypt.compare(parola, utilizator.parola);
    if (!parolaE_Buna) {
      return res.status(400).json({ error: "Email sau parolă incorectă!" });
    }

    const CHEIE_SECRETA = process.env.CHEIE_SECRETA;
    const token = jwt.sign(
      { id: utilizator._id, email: utilizator.email }, 
      CHEIE_SECRETA, 
      { expiresIn: "24h" } 
    );

    res.json({ mesaj: "Te-ai logat cu succes!", token: token, email: utilizator.email });
  } catch (err) {
    console.error("Eroare la login:", err);
    res.status(500).json({ error: "Eroare la logare." });
  }
});

// --- RUTA: AI UITAT PAROLA? ---
router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  try {
    const utilizator = await User.findOne({ email });
    if (!utilizator) {
      return res.status(404).json({ error: "Nu există un cont cu acest email." });
    }

    // Generăm un token aleatoriu
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash-uim token-ul și îl salvăm în DB cu expirare
    utilizator.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    utilizator.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minute

    await utilizator.save();

    // Creăm link-ul de resetare (folosim localhost pentru dev)
    const resetUrl = `http://localhost:5174/reset-password/${resetToken}`;

    const mesajEmail = `
      <h1>Ai solicitat resetarea parolei</h1>
      <p>Te rugăm să accesezi link-ul de mai jos pentru a-ți schimba parola. Acest link expiră în 10 minute:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>Dacă nu ai solicitat acest lucru, te rugăm să ignori acest email.</p>
    `;

    // Configurare transport Nodemailer (Standard pentru Gmail cu App Password)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Folosim SSL pe portul 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Study Tracker" <${process.env.EMAIL_FROM}>`,
      to: utilizator.email,
      subject: "Resetare Parolă - Study Tracker",
      html: mesajEmail,
    };

    await transporter.sendMail(mailOptions);

    res.json({ mesaj: "Email-ul de resetare a fost trimis!" });

  } catch (err) {
    console.error("Eroare DETALIATĂ la forgotpassword:", err);
    res.status(500).json({ error: "Eroare la trimiterea email-ului de resetare." });
  }
});

// --- RUTA: RESETARE PAROLA EFECTIVA ---
router.put('/resetpassword/:resettoken', async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  try {
    const utilizator = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!utilizator) {
      return res.status(400).json({ error: "Token-ul este invalid sau a expirat." });
    }

    // Hash-uim noua parolă
    const salt = await bcrypt.genSalt(10);
    utilizator.parola = await bcrypt.hash(req.body.parola, salt);

    // Ștergem câmpurile de reset
    utilizator.resetPasswordToken = undefined;
    utilizator.resetPasswordExpire = undefined;

    await utilizator.save();

    res.json({ mesaj: "Parola a fost actualizată cu succes!" });

  } catch (err) {
    console.error("Eroare la resetpassword:", err);
    res.status(500).json({ error: "Eroare la resetarea parolei." });
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
