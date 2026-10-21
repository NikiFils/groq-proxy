const express = require('express');
const app = express();

// Этот файл нужен только для того, чтобы Vercel понял, что это Express-проект.
// Он перенаправляет все запросы в папку api.
app.all('*', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;