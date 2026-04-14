const jwt = require('jsonwebtoken');

const verificaToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: "Nu ai token!" });

  try {
    const CHEIE_SECRETA = process.env.CHEIE_SECRETA;
    const decriptat = jwt.verify(token, CHEIE_SECRETA);
    req.user = decriptat; 
    next();
  } catch (err) {
    res.status(400).json({ error: "Token invalid sau expirat." });
  }
};

module.exports = verificaToken;
