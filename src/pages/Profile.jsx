// Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInAction, signOut } from '../authSlice';
import { Header } from '../components/Header';
import { url } from '../const';
import './profile.scss';

export const Profile = () => {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'username']);
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 未ログインの場合はサインインページにリダイレクト
    if (!auth) {
      navigate('/login');
      return;
    }

    // ユーザー情報を取得してフォームに事前入力
    axios
      .get(`${url}/users`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      })
      .then((res) => {
        setName(res.data.name);
      })
      .catch((err) => {
        setErrorMessage(`ユーザー情報の取得に失敗しました。${err.message}`);
        console.error('Error fetching user info:', err);
      });
  }, [auth, cookies.token, navigate]);

  const handleNameChange = (e) => setName(e.target.value);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!name) {
      setErrorMessage('ユーザー名を入力してください。');
      return;
    }

    // ユーザー情報を更新
    axios
      .put(
        `${url}/users`,
        { name },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      )
      .then((res) => {
        setName(res.data.name);
        // Reduxとクッキーのユーザー名を更新
        dispatch(signInAction({ username: res.data.name }));
        setCookie('username', res.data.name, { path: '/' });
        // 成功時にホーム画面に遷移
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`ユーザー情報の更新に失敗しました。${err.message}`);
        console.error('Error updating user info:', err);
      });
  };

  const handleSignOut = () => {
    dispatch(signOut());
    removeCookie('token');
    removeCookie('username');
    navigate('/login');
  };

  return (
    <div>
      <Header />
      <main className="profile">
        <h2>ユーザー情報編集</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="profile-form" onSubmit={handleUpdate}>
          <label htmlFor="name">ユーザー名</label>
          <br />
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="name-input"
            required
          />
          <br />
          <button type="submit" className="update-button">
            更新
          </button>
        </form>
      </main>
    </div>
  );
};
