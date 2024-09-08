import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import './signIn.scss';
import { useDispatch, useSelector } from 'react-redux';
import { signInAction } from '../authSlice';
import { url } from '../const';

export const SignIn = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [, setCookie] = useCookies(['token']); // 修正

  useEffect(() => {
    if (auth) {
      navigate('/');
    }
  }, [auth, navigate]);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const onSignIn = (e) => { // イベントオブジェクトを引数として受け取るように修正
    e.preventDefault(); // フォームのデフォルト動作を防止

    if (!email || !password) {
      setErrorMessage('メールアドレスとパスワードは必須です。');
      return;
    }

    axios
      .post(`${url}/login`, { email: email, password: password })
      .then((res) => {
        setCookie('token', res.data.token); // クッキーにトークンを設定
        dispatch(signInAction()); // アクションをディスパッチ
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`サインインに失敗しました。${err.message}`);
      });
  };

  if (auth) return <Navigate to="/" />;

  return (
    <div>
      <Header />
      <main className="signin">
        <h2>サインイン</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signin-form">
          <label className="email-label">メールアドレス</label>
          <br />
          <input
            type="email"
            className="email-input"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <br />
          <label className="password-label">パスワード</label>
          <br />
          <input
            type="password"
            className="password-input"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <br />
          <button type="submit" className="signin-button" onClick={onSignIn}>
            サインイン
          </button>
        </form>
        <Link to="/signup">新規作成</Link>
      </main>
    </div>
  );
};
