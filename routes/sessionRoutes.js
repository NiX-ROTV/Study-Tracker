const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const verificaToken = require('../middleware/authMiddleware');

router.post('/', verificaToken, async (req, res) => {
  const { materie_id, materie_nume, timp_secunde } = req.body;
  if (!materie_id || !materie_nume || timp_secunde == null) return res.status(400).json({ error: "Date incomplete!" });

  try {
    const nouaSesiune = new Session({
      user_id: req.user.id, 
      materie_id, materie_nume, timp_secunde
    });
    const sesiuneSalvata = await nouaSesiune.save();
    res.status(201).json(sesiuneSalvata);
  } catch (err) {
    res.status(500).json({ error: "Eroare interna." });
  }
});

router.get('/', verificaToken, async (req, res) => {
  try {
    const sesiuni = await Session.find({ user_id: req.user.id }).populate('materie_id', 'nume');
    res.status(200).json(sesiuni);
  } catch (err) {
    res.status(500).json({ error: "Eroare la aducerea istoricului." });
  }
});

module.exports = router;
