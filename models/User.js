const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Numele cu care se va loga utilizatorul
  username: {
    type: String,
    required: true,
    unique: true // Baza de date nu va permite 2 conturi cu acelasi nume
  },
  // Parola (care va fi salvata in mod criptat)
  parola: {
    type: String,
    required: true
  },
  // Data la care si-a creat contul
  data_creare: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);