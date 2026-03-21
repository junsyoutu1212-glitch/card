// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// 정적 파일 서빙 (index.html 포함 같은 폴더)
app.use(express.static(__dirname));

// ---- 아래는 방문 로그 API ----
const visits = [];

function getIp(req) {
  const xfwd = req.headers['x-forwarded-for'];
  if (xfwd) return xfwd.split(',')[0].trim();
  return req.socket?.remoteAddress || req.ip || 'unknown';
}

app.post('/api/visit', (req, res) => {
  const ip = getIp(req);
  const ua = req.headers['user-agent'] || '';
  const now = new Date().toISOString();

  visits.push({ ip, userAgent: ua, time: now });
  res.json({ ok: true });
});

app.get('/api/getvisituser', (req, res) => {
  res.json({ count: visits.length, visits });
});

app.listen(PORT, () => {
  console.log('Server listening on', PORT);
});
