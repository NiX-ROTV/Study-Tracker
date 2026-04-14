require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import rute
const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const homeworkRoutes = require('./routes/homeworkRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();
app.use(cors());

// Middleware pentru a citi datele JSON
app.use(express.json());

// Conectarea la baza de date
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then(() => console.log("Baza de date MongoDB Atlas conectata cu succes!"))
    .catch(err => console.log("Eroare la conectare Atlas:", err));
    
app.get('/', (req, res) => {
    res.send('Serverul functioneaza perfect!');
});

// Folosire rute
app.use('/api', authRoutes); // /api/login, /api/register, /api/user
app.use('/api/subjects', subjectRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/schedule', scheduleRoutes);

// Pornirea serverului
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
});