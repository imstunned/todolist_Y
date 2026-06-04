/* eslint-env node */

console.log('SERVER FILE LOADED:', import.meta.url);

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/', (req, res) => {
  console.log('GET / called');
  res.send('PoE proxy server is running');
});

app.get('/api/poe-currency', async (req, res) => {
  try {
    const league = req.query.league || 'Standard';

    const url = new URL('https://poe.ninja/poe1/api/economy/exchange/current/overview');

    url.searchParams.set('league', league);
    url.searchParams.set('type', 'Currency');

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        message: `poe.ninja вернул ошибку ${response.status}`,
        url: url.toString(),
      });
    }

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Не удалось загрузить данные poe.ninja',
    });
  }
});

app.use((req, res) => {
  console.log('UNKNOWN ROUTE:', req.method, req.url);

  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    url: req.url,
  });
});

app.listen(PORT, () => {
  console.log(`PoE proxy server started on port ${PORT}`);
});