const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  // Câmpul NOU: Leagă sesiunea de un utilizator anume
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  materie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  // CÂMPUL NOU ADĂUGAT: "Poza de moment" a numelui
  materie_nume: {
    type: String,
    required: true
  },
  timp_secunde: {
    type: Number,
    required: true
  },
  data_sesiune: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', sessionSchema);