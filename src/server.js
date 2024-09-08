const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // リクエストボディを解析するためのミドルウェア

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

// リクエストボディの解析
app.use(bodyParser.json()); // JSONボディを解析する

// ユーザーサインアップエンドポイント
app.post('/users', (req, res) => {
  try {
    const userData = req.body;

    // データの検証
    if (!userData.email || !userData.password) {
      return res.status(400).send('メールアドレスとパスワードが必要です');
    }

    // サインアップ処理の仮実装（ここにサインアップ処理を追加）
    // ...

    res.status(200).send('サインアップ成功');
  } catch (error) {
    console.error('サーバーエラー:', error);
    res.status(500).send('サーバーエラー');
  }
});

// サーバー起動
app.listen(5000, () => {
  console.log('サーバーがポート5000で起動しています');
});
