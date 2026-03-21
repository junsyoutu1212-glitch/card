// server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 메모리에 방문 기록 저장 (실제 서비스면 DB로 교체)
const visits = [];

// IP 추출 헬퍼
function getIp(req) {
  const xfwd = req.headers['x-forwarded-for'];
  if (xfwd) {
    return xfwd.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || 'unknown';
}

// 방문 기록 API
app.post('/api/visit', (req, res) => {
  const ip = getIp(req);
  const ua = req.headers['user-agent'] || '';
  const now = new Date().toISOString();

  visits.push({
    ip,
    userAgent: ua,
    time: now,
  });

  res.json({ ok: true });
});

// 방문자 조회 API
app.get('/api/getvisituser', (req, res) => {
  res.json({
    count: visits.length,
    visits,
  });
});

// 헬스체크용
app.get('/', (req, res) => {
  res.send('visit logger running');
});

app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
