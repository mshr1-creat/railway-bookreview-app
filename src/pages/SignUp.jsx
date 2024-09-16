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
  const auth = useSelector((state) => state.auth.isSignIn); // Reduxストアからユーザーのサインイン状態を取得する
  const dispatch = useDispatch(); // Reduxのアクションをディスパッチするための関数を取得する
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [, setCookie] = useCookies();

  // ユーザーが既にサインインしている場合、ホームページ（'/'）にリダイレクトする
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
        quality: 0.5,
        success(result) {
          setProfilePicture(result);
        },
        error(err) {
          // err の型を明示
          console.error('Error during image compression:', err); // エラーをログ出力
          setErrorMessage('画像の圧縮に失敗しました。');
        },
      });
    }
  };

  // プロフィール画像のアップロード
  const handleSignUp = async () => {
    if (!email || !name || !password) {
      setErrorMessage('全てのフィールドを入力してください。');
      return;
    }

    const data = {
      email,
      name,
      password,
    };

    try {
      // サーバにユーザー情報を送信し、サインアップする
      await axios.post(`${url}/users`, data);

      // サインインしてトークンを取得
      const signInRes = await axios.post(`${url}/signin`, {
        email,
        password,
      });
      const token = signInRes.data.token;
      setCookie('token', token, { path: '/' });
      dispatch(signInAction()); // ユーザーがサインインした状態であることをReduxストアに通知する

      if (profilePicture) {
        const formData = new FormData();
        formData.append('icon', profilePicture); // 画像ファイルを icon フィールドとしてフォームデータに追加する

        try {
          // プロフィール画像をサーバにアップロード
          await axios.post(`${url}/uploads`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`, // 認証トークンをヘッダーに含める
            },
          });

          // ユーザー情報を取得して iconUrl を確認
          const userRes = await axios.get(`${url}/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const iconUrl = userRes.data.iconUrl;

          // 必要であれば、iconUrl をアプリケーション内で使用
          console.log('Icon URL:', iconUrl);
        } catch (uploadErr) {
          setErrorMessage(
            `画像のアップロードに失敗しました。 ${uploadErr.message}`
          );
          return;
        }
      }

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
          <button
            type="button"
            onClick={handleSignUp}
            className="signup-button"
          >
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
