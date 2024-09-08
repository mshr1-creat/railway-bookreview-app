// server.js
const express = require('express');
const cors = require('cors');

const app = express();

// CORS設定を追加
app.use(
  cors({
    origin: 'http://localhost:3001', // クライアントのURL
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // 許可するメソッド
    allowedHeaders: 'Content-Type,Authorization', // 許可するヘッダー
  })
);

// プリフライトリクエストへの対応
app.options('*', cors());

// ルートや他のミドルウェアの設定
app.post('/users', (req, res) => {
  // サインアップ処理
  res.send('サインアップ成功');
});

app.listen(5000, () => {
  console.log('サーバーがポート5000で起動しています');
});
