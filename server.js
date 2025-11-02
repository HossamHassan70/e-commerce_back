process.on('uncaughtException', err => {
  console.error(' Uncaught Error:', err);
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const pool = require('./db');

// ✅ Imports (بدون .default)
const reviewRoutes = require('./routes/review');
const addressRoutes = require('./routes/address');
const categoryRoutes = require('./routes/category');

// ✅ Routes
app.use('/reviews', reviewRoutes);
app.use('/', addressRoutes);
app.use('/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.send('API IS running successfully ');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
