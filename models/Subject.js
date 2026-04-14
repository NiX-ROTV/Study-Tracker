const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nume: {
        type: String,
        required: true
    },
    profesor: {
        type: String,
        required: false
    },
    are_teza: {
        type: Boolean,
        default: false
    },
    data_adaugarii: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subject', SubjectSchema);