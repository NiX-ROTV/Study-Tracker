require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

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



// Folosire rute
app.use('/api', authRoutes); // /api/login, /api/register, /api/user
app.use('/api/subjects', subjectRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/schedule', scheduleRoutes);

// Servirea fișierelor statice de pe Frontend (React / Vite)
const buildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(buildPath));

app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'Eroare 404: Ruta API nu exista' });
    }
    res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serverul ruleaza perfect si este deschis catre exterior pe portul ${PORT}`);
});