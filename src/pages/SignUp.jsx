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
  const [cookies, setCookie] = useCookies();
  const [iconUrl, setIconUrl] = useState(null); // アップロードされた画像のURLを保存する状態

  useEffect(() => {
    // トークンが取得されているか確認
    console.log('Token from cookies:', cookies.token);

    if (auth) {
      navigate('/');
    }
  }, [auth, navigate, cookies.token]);

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
  const uploadProfilePicture = async () => {
    if (!cookies.token) {
      setErrorMessage('認証トークンが見つかりません。');
      return null;
    }

    if (!profilePicture) return null;

    const formData = new FormData();
    formData.append('icon', profilePicture);

    try {
      const res = await axios.post(`${url}/uploads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${cookies.token}`, // トークンを追加
        },
      });
      return res.data.iconUrl; // アップロードした画像のURLを取得
    } catch (err) {
      setErrorMessage(`画像のアップロードに失敗しました。 ${err.message}`);
      return null;
    }
  };

  const onSignUp = async () => {
    // // トークンが存在するかチェック
    // if (!cookies.token) {
    //   setErrorMessage('認証トークンが見つかりません。');
    //   return;
    // }

    if (!email || !name || !password) {
      setErrorMessage('全てのフィールドを入力してください。');
      return;
    }

    // プロフィール画像をアップロード
    const uploadedIconUrl = await uploadProfilePicture();

    if (uploadedIconUrl) {
      // アップロードに成功した場合、URLをトークンとして保存
      setIconUrl(uploadedIconUrl);
      setCookie('iconToken', uploadedIconUrl, { path: '/' });
    } else {
      setErrorMessage('プロフィール画像のアップロードに失敗しました。');
      return;
    }

    const data = {
      email,
      name,
      password,
      iconUrl: uploadedIconUrl, // アップロードされた画像URLをサインアップデータとして送信
    };

    try {
      const res = await axios.post(`${url}/users`, data);
      const token = res.data.token;
      setCookie('token', token, { path: '/' }); // path を設定
      dispatch(signInAction());
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
