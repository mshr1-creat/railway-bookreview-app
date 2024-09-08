import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import Compressor from 'compressorjs'; // Compressor を使用して画像のリサイズを行う
import { signInAction } from '../authSlice';
import { Header } from '../components/Header';
import { url } from '../const';
import './signUp.scss';

export const SignUp = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [, setCookie] = useCookies();

  useEffect(() => {
    if (auth) {
      navigate('/');
    }
  }, [auth, navigate]);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Compressor を使用して画像のリサイズを行う
    if (file) {
      new Compressor(file, {
        quality: 0.8,
        success(result) {
          setProfilePicture(result);
        },
        error(err) { // err の型を明示
          console.error('Error during image compression:', err); // エラーをログ出力
          setErrorMessage('画像の圧縮に失敗しました。');
        },
      });
    }
  };

  const onSignUp = async () => {
    if (!email || !name || !password) {
      setErrorMessage('全てのフィールドを入力してください。');
      return;
    }

    const data = new FormData();
    data.append('email', email);
    data.append('name', name);
    data.append('password', password);
    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }

    try {
      const res = await axios.post(`${url}/users`, data);
      const token = res.data.token;
      dispatch(signInAction());
      setCookie('token', token);
      navigate('/');
    } catch (err) {
      setErrorMessage(`サインアップに失敗しました。 ${err.message}`);
    }
  };

  if (auth) return <Navigate to="/" />;

  return (
    <div>
      <Header />
      <main className="signup">
        <h2>新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="signup-form">
          <label>メールアドレス</label>
          <br />
          <input
            type="email"
            onChange={handleEmailChange}
            className="email-input"
            required
          />
          <br />
          <label>ユーザ名</label>
          <br />
          <input
            type="text"
            onChange={handleNameChange}
            className="name-input"
            required
          />
          <br />
          <label>パスワード</label>
          <br />
          <input
            type="password"
            onChange={handlePasswordChange}
            className="password-input"
            required
          />
          <br />
          <label>プロフィール画像</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <br />
          <button type="button" onClick={onSignUp} className="signup-button">
            作成
          </button>
        </form>
        <p>
          すでにアカウントをお持ちですか？ <a href="/login">ログイン</a>
        </p>
      </main>
    </div>
  );
};
