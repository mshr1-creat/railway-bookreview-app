// src/App.jsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = (event) => {
    event.preventDefault(); // フォームのデフォルト送信動作を防ぐ
    const email = event.target.email.value; // メールアドレスの値を取得
    const password = event.target.password.value; // パスワードの値を取得
    let valid = true; // バリデーションの状態を示す
    let errors = { email: '', password: '' }; // エラーメッセージの初期状態

    if (!email.includes('@')) {
      errors.email = 'メールアドレスが無効です'; // エラーメッセージを設定
      valid = false; // バリデーション失敗
    }

    if (password.length < 6) {
      errors.password = 'パスワードは6文字以上でなければなりません';
      valid = false;
    }

    setErrors(errors); // エラーメッセージをステートに設定

    if (valid) {
      // フォーム送信処理
    }
  };

  return (
    <div className="App">
      <h1>ログイン画面</h1>
      <form id="loginForm" onSubmit={validateForm}>
        <div>
          <label htmlFor="email">メールアドレス:</label>
          <input type="email" name="email" id="email" placeholder="Email" />
          <span id="emailError" className="error">
            {errors.email}
          </span>
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input type="password" name="password" id="password" />
          <span id="passwordError" className="error">
            {errors.password}
          </span>
        </div>
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}

export default App;
