const express = require('express');
const router = express.Router();
const Homework = require('../models/Homework');
const verificaToken = require('../middleware/authMiddleware');

router.post('/', verificaToken, async (req, res) => {
  const { materie_id, descriere, dificultate } = req.body;
  const userId = req.user.id;

  const reguli = {
    usoara: { xp: 15, cooldown: 10, minChar: 20 },
    medie: { xp: 40, cooldown: 30, minChar: 40 },
    grea: { xp: 100, cooldown: 60, minChar: 80 }
  };

  const regula = reguli[dificultate];

  if (!regula) {
      return res.status(400).json({ error: "Dificultate invalida." });
  }

  if (descriere.length < regula.minChar) {
    return res.status(400).json({ error: `Descrierea este prea scurta pentru o tema ${dificultate}. Scrie macar ${regula.minChar} caractere.` });
  }

  try {
    const acum = new Date();
    const inceputZi = new Date().setHours(0, 0, 0, 0);

    const temeAzi = await Homework.find({ user_id: userId, data_finalizare: { $gte: inceputZi } });
    const xpAzi = temeAzi.reduce((total, t) => total + t.xp_primit, 0);

    if (xpAzi + regula.xp > 300) {
      return res.status(400).json({ error: "Ai atins limita de 300 XP din teme pe astazi! Creierul tau are nevoie de pauza." });
    }

    const ultimaTema = await Homework.findOne({ user_id: userId }).sort({ data_finalizare: -1 });
    if (ultimaTema) {
      const minuteScurse = (acum - ultimaTema.data_finalizare) / (1000 * 60);
      const cooldownNecesar = reguli[ultimaTema.dificultate].cooldown;

      if (minuteScurse < cooldownNecesar) {
        const rest = Math.ceil(cooldownNecesar - minuteScurse);
        return res.status(400).json({ error: `Esti in cooldown! Mai asteapta ${rest} minute inainte sa raportezi o noua tema.` });
      }
    }

    const temaNoua = new Homework({
      user_id: userId,
      materie_id,
      descriere,
      dificultate,
      xp_primit: regula.xp
    });

    await temaNoua.save();
    res.status(201).json({ mesaj: `Bravo! Ai primit ${regula.xp} XP.`, tema: temaNoua });
  } catch (err) {
    res.status(500).json({ error: "Eroare la salvarea temei." });
  }
});

router.get('/', verificaToken, async (req, res) => {
  try {
    const teme = await Homework.find({ user_id: req.user.id })
                               .populate('materie_id', 'nume')
                               .sort({ data_finalizare: -1 });
    res.json(teme);
  } catch (err) {
    res.status(500).json({ error: "Eroare la incarcarea istoricului de misiuni." });
  }
});

module.exports = router;
