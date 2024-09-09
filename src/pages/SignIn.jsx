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
  const auth = useSelector((state) => state.auth.isSignIn); // •	Reduxのauth状態から、ユーザーがサインインしているかどうか（isSignIn）を取得
  const dispatch = useDispatch(); // サインイン成功時にsignInActionを呼び出して、ユーザーの認証状態を更新する
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [, setCookie] = useCookies(['token']); // 修正

  useEffect(() => {
    if (auth) {
      navigate('/');
    }
  }, [auth, navigate]); // authの状態が変更されたときに再実行される

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const onSignIn = (e) => { // イベントオブジェクトを引数として受け取るように修正
    e.preventDefault(); // フォームのデフォルト動作を防止

    if (!email || !password) {
      setErrorMessage('メールアドレスとパスワードは必須です。');
      return;
    }

    axios
      .post(`${url}/signin`, { email: email, password: password }) // signinをloginに修正
      .then((res) => {
        console.log('Token received:', res.data.token); // ここでトークンが正しく取得できているか確認
        setCookie('token', res.data.token); // クッキーにトークンを設定 成功すると、res.data.tokenにJWTトークンが含まれており、それをクッキーに保存する
        dispatch(signInAction()); // dispatch(signInAction())でReduxの認証状態を更新し、navigate('/')でトップページにリダイレクトする
        navigate('/');
      })
      .catch((err) => {
        console.error('Error during sign in:', err.message); // エラーメッセージの表示
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
