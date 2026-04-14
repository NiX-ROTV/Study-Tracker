const mongoose = require('mongoose');

const HomeworkSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  materie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  descriere: { type: String, required: true },
  dificultate: { type: String, enum: ['usoara', 'medie', 'grea'], required: true },
  xp_primit: { type: Number, required: true },
  data_finalizare: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Homework', HomeworkSchema);