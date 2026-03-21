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
app.use(express.static(__dirname));

// ---- 방문 로그 메모리 저장 ----
const visits = [];

function getIp(req) {
  const xfwd = req.headers['x-forwarded-for'];
  if (xfwd) return xfwd.split(',')[0].trim();
  return req.socket?.remoteAddress || req.ip || 'unknown';
}

// IP 조회 API (서버가 감지한 IP 반환)
app.get('/api/myip', (req, res) => {
  const ip = getIp(req);
  res.json({ ip });
});

// 방문 기록 API (클라이언트가 보낸 IP 저장)
app.post('/api/visit', (req, res) => {
  const ip = req.body.ip || getIp(req);
  const ua = req.headers['user-agent'] || '';
  const now = new Date().toISOString();

  visits.push({ ip, userAgent: ua, time: now });
  res.json({ ok: true });
});

// 방문자 조회 API
app.get('/api/getvisituser', (req, res) => {
  res.json({ count: visits.length, visits });
});

app.listen(PORT, () => {
  console.log('Server listening on', PORT);
});
