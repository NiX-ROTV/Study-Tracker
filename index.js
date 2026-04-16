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

// AICI E MAGIA: Deschidem CORS-ul pentru toata lumea ca sa dovedim ca asta era blocajul
app.use(cors({
    origin: '*'
}));

// Middleware pentru a citi datele JSON
app.use(express.json());

// Conectarea la baza de date
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then(() => console.log("Baza de date MongoDB Atlas conectata cu succes!"))
    .catch(err => console.log("Eroare la conectare Atlas:", err));

// Ruta de baza (Health check) care tine serverul in viata pentru Railway
app.get('/', (req, res) => {
    res.send('Backend-ul din cloud functioneaza perfect!');
});

// Folosire rute
app.use('/api', authRoutes); // /api/login, /api/register, /api/user
app.use('/api/subjects', subjectRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/schedule', scheduleRoutes);

// Am sters portiunea veche care servea fisierele statice de React

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serverul ruleaza perfect si este deschis catre exterior pe portul ${PORT}`);
});