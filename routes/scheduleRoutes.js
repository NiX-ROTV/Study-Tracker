const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const verificaToken = require('../middleware/authMiddleware');

// ─── GET /api/schedule ────────────────────────────────────
// Returnează orarul complet al utilizatorului (config + blocuri)
router.get('/', verificaToken, async (req, res) => {
  try {
    const orar = await Schedule.findOne({ user_id: req.user.id })
                               .populate('blocks.materie_id', 'nume profesor');
    
    // Dacă nu are orar, trimitem null (frontend-ul va arăta Setup Wizard)
    res.json(orar);
  } catch (err) {
    console.log("Eroare la încărcarea orarului:", err);
    res.status(500).json({ error: "Eroare la încărcarea orarului." });
  }
});

// ─── POST /api/schedule/config ────────────────────────────
// Creează sau actualizează configurația orarului (Faza 1 - Setup Wizard)
router.post('/config', verificaToken, async (req, res) => {
  const { oraStart, oraEnd } = req.body;
  
  if (!oraStart || !oraEnd) {
    return res.status(400).json({ error: "Specifică ora de start și ora de final." });
  }

  try {
    let orar = await Schedule.findOne({ user_id: req.user.id });
    
    if (orar) {
      // Actualizare configurație existentă
      orar.oraStart = oraStart;
      orar.oraEnd = oraEnd;
      orar.blocks = []; // resetăm blocurile când se reconfigurează
      await orar.save();
    } else {
      // Creare orar nou
      orar = new Schedule({
        user_id: req.user.id,
        oraStart,
        oraEnd,
        blocks: []
      });
      await orar.save();
    }

    res.status(201).json(orar);
  } catch (err) {
    console.log("Eroare la salvarea configurației:", err);
    res.status(500).json({ error: "Eroare la salvarea configurației." });
  }
});

// ─── POST /api/schedule/block ─────────────────────────────
// Adaugă un bloc nou în orar
router.post('/block', verificaToken, async (req, res) => {
  const { zi, slotStart, sloturi, materie_id, sala, paritate } = req.body;

  if (zi === undefined || slotStart === undefined || !sloturi || !materie_id) {
    return res.status(400).json({ error: "Toate câmpurile sunt necesare." });
  }

  try {
    const orar = await Schedule.findOne({ user_id: req.user.id });
    if (!orar) return res.status(404).json({ error: "Configurează orarul mai întâi." });

    // Verificăm suprapuneri
    let suprapunere = false;
    const paritateIntrare = paritate || 'toate';

    orar.blocks.forEach(b => {
      if (b.zi !== zi) return;
      const startNou = slotStart;
      const endNou = slotStart + sloturi;
      const startExistent = b.slotStart;
      const endExistent = b.slotStart + b.sloturi;

      // dacă se intersectează pe axa timpului
      if (startNou < endExistent && endNou > startExistent) {
        const pariExistent = b.paritate || 'toate';
        if (paritateIntrare === 'toate' || pariExistent === 'toate') {
          suprapunere = true;
        } else if (paritateIntrare === pariExistent) {
          suprapunere = true;
        }
      }
    });

    if (suprapunere) {
      return res.status(400).json({ error: "Există deja o materie setată în acest interval cu conflict de paritate." });
    }

    orar.blocks.push({ zi, slotStart, sloturi, materie_id, sala: sala || '', paritate: paritateIntrare });
    await orar.save();
    
    // Re-populăm pentru a trimite înapoi numele materiei
    const orarPopulat = await Schedule.findById(orar._id)
                                     .populate('blocks.materie_id', 'nume profesor');
    res.status(201).json(orarPopulat);
  } catch (err) {
    console.log("Eroare la adăugarea blocului:", err);
    res.status(500).json({ error: "Eroare la adăugarea blocului." });
  }
});

// ─── PUT /api/schedule/block/:blockId ─────────────────────
// Editează un bloc existent
router.put('/block/:blockId', verificaToken, async (req, res) => {
  const { materie_id, sloturi, sala, paritate } = req.body;

  try {
    const orar = await Schedule.findOne({ user_id: req.user.id });
    if (!orar) return res.status(404).json({ error: "Orarul nu există." });

    const bloc = orar.blocks.id(req.params.blockId);
    if (!bloc) return res.status(404).json({ error: "Blocul nu există." });

    // Verificăm suprapuneri (excluzând blocul curent)
    const sloturiVerif = sloturi || bloc.sloturi;
    const paritateVerif = paritate !== undefined ? paritate : (bloc.paritate || 'toate');
    
    let suprapunere = false;
    orar.blocks.forEach(b => {
      if (b._id.toString() === req.params.blockId) return;
      if (b.zi !== bloc.zi) return;
      const startNou = bloc.slotStart;
      const endNou = bloc.slotStart + sloturiVerif;
      const startExistent = b.slotStart;
      const endExistent = b.slotStart + b.sloturi;

      if (startNou < endExistent && endNou > startExistent) {
        const pariExistent = b.paritate || 'toate';
        if (paritateVerif === 'toate' || pariExistent === 'toate') {
          suprapunere = true;
        } else if (paritateVerif === pariExistent) {
          suprapunere = true;
        }
      }
    });

    if (suprapunere) {
      return res.status(400).json({ error: "Noua durată sau paritate intră în conflict cu altă materie." });
    }
    
    if (sloturi) bloc.sloturi = sloturi;
    if (materie_id) bloc.materie_id = materie_id;
    if (sala !== undefined) bloc.sala = sala;
    if (paritate !== undefined) bloc.paritate = paritate;

    await orar.save();
    const orarPopulat = await Schedule.findById(orar._id)
                                     .populate('blocks.materie_id', 'nume profesor');
    res.json(orarPopulat);
  } catch (err) {
    console.log("Eroare la editarea blocului:", err);
    res.status(500).json({ error: "Eroare la editarea blocului." });
  }
});

// ─── DELETE /api/schedule/block/:blockId ───────────────────
// Șterge un bloc din orar
router.delete('/block/:blockId', verificaToken, async (req, res) => {
  try {
    const orar = await Schedule.findOne({ user_id: req.user.id });
    if (!orar) return res.status(404).json({ error: "Orarul nu există." });

    const bloc = orar.blocks.id(req.params.blockId);
    if (!bloc) return res.status(404).json({ error: "Blocul nu există." });

    bloc.deleteOne();
    await orar.save();

    const orarPopulat = await Schedule.findById(orar._id)
                                     .populate('blocks.materie_id', 'nume profesor');
    res.json(orarPopulat);
  } catch (err) {
    console.log("Eroare la ștergerea blocului:", err);
    res.status(500).json({ error: "Eroare la ștergerea blocului." });
  }
});

module.exports = router;
