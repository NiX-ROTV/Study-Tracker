const mongoose = require('mongoose');

const ScheduleBlockSchema = new mongoose.Schema({
  zi: { type: Number, required: true },        // 0=Luni, 1=Marți ... 4=Vineri
  slotStart: { type: Number, required: true },  // indexul slotului de 30 min (relativ la oraStart)
  sloturi: { type: Number, required: true },    // câte sloturi de 30 min durează
  sala: { type: String, default: '' },           // sala de curs/laborator
  paritate: { type: String, enum: ['toate', 'para', 'impara'], default: 'toate' },
  materie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  }
});

const ScheduleSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true   // un singur orar per utilizator
  },
  oraStart: { type: String, required: true, default: '08:00' },
  oraEnd: { type: String, required: true, default: '16:00' },
  blocks: [ScheduleBlockSchema]
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
