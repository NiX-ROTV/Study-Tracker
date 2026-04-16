const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Email-ul cu care se va loga utilizatorul
  email: {
    type: String,
    required: [true, "Email-ul este obligatoriu"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Te rugăm să introduci un email valid"]
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
  },
  // Token pentru resetarea parolei
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

module.exports = mongoose.model('User', userSchema);