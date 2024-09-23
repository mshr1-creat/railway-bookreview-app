import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signInAction, signOut } from '../authSlice';
import './header.scss';

export const Header = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const username = useSelector((state) => state.auth.username); // Reduxから取得
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(['token', 'username']);

  const handleSignOut = () => {
    dispatch(signOut());
    removeCookie('token');
    removeCookie('username');
    navigate('/signin');
  };

  // デバッグ用のログ出力
  console.log('Auth:', auth);
  console.log('Username:', username);

  // ページリロード時にクッキーから認証情報を読み込み、Reduxの状態を更新
  useEffect(() => {
    if (!auth && cookies.token && cookies.username) {
      dispatch(signInAction({ username: cookies.username }));
    }
  }, [auth, cookies.token, cookies.username, dispatch]);

  return (
    <header className="header">
      <h1>書籍レビュー</h1>
      {auth ? (
        <div className="header__user-info">
          {username && <p className="header__user">ようこそ、{username}さん</p>}
          <button onClick={handleSignOut} className="sign-out-button">
            サインアウト
          </button>
        </div>
      ) : (
        <></>
      )}
    </header>
  );
};
