const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const verificaToken = require('../middleware/authMiddleware');

router.post('/', verificaToken, async (req, res) => {
    const { nume, profesor, are_teza } = req.body;
    if (!nume) return res.status(400).json({ error: "Numele este obligatoriu." });

    try {
        const nouaSubiect = new Subject({
            user_id: req.user.id, 
            nume, profesor, are_teza
        });
        const subiectSalvat = await nouaSubiect.save();
        res.status(201).json(subiectSalvat);
    } catch (err) {
        res.status(500).json({ error: "Eroare la salvare." });
    }
});

router.get('/', verificaToken, async (req, res) => {
    try {
        const materii = await Subject.find({ user_id: req.user.id });
        res.json(materii);
    } catch (err) {
        res.status(500).json({ error: "Eroare la preluare." });
    }
});

router.delete('/:id', verificaToken, async (req, res) => {
    try {
        const materieStearsa = await Subject.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
        if (!materieStearsa) return res.status(404).json({ error: "Materia nu exista sau nu iti apartine." });
        res.json({ mesaj: "Materia a fost stearsa!" });
    } catch (err) {
        res.status(500).json({ error: "Eroare la stergere." });
    }
});

router.put('/:id', verificaToken, async (req, res) => {
    const { nume, profesor, are_teza } = req.body;
    if (!nume || nume.trim() === '') return res.status(400).json({ error: "Numele este obligatoriu." });

    try {
        const materieActualizata = await Subject.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.id },
            { nume: nume.trim(), profesor, are_teza },
            { new: true }
        );
        if (!materieActualizata) return res.status(404).json({ error: "Materia nu exista sau nu iti apartine." });
        res.json(materieActualizata);
    } catch (err) {
        res.status(500).json({ error: "Eroare la actualizare." });
    }
});

module.exports = router;
