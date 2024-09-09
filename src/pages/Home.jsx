import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Header } from '../components/Header';
import { url } from '../const';
import './bookReviews.scss'; // BEMのクラス設計に基づいたCSS

export const Home = () => {
  const [books, setBooks] = useState([]); // 書籍レビューのデータを保持する状態 初期値は空の配列を設定
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies(); // クッキーからトークンを取得する cookies.token にトークンが保存されている

  // コンポーネントがレンダリングされた際に一度だけ実行される
  useEffect(() => {
    // 取得したトークンをログに表示して確認する
    console.log('Token from cookies:', cookies.token);
    console.log('Token from localStorage:', localStorage.getItem('token')); // JWTトークンのフォーマット（3つのセグメントに分かれているか）を確認

    // トークンが正しい形式か確認
    if (cookies.token && cookies.token.split('.').length !== 3) {
      console.error('Invalid JWT token format');
      setErrorMessage('不正なトークン形式です。再度ログインしてください。');
      return;
    }

    // トークンが存在しない場合は早期リターン
    if (!cookies.token) {
      setErrorMessage('認証トークンが見つかりません。ログインしてください。');
      return;
    }

    // 書籍レビューの先頭10件を取得
    axios
      .get(`${url}/books?offset=0`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`, // クッキーからトークンを取得しているか確認
        },
      })
      .then((res) => {
        console.log('API response data:', res.data); // 取得したデータを確認
        setBooks(res.data.slice(0, 10)); // 先頭10件を取得
      })
      .catch((err) => {
        setErrorMessage(`書籍レビューの取得に失敗しました。${err.message}`);
        console.error(
          'Error fetching books:',
          err.response ? err.response.data : err.message
        );
      });
  }, []);

  console.log(cookies.token);

  return (
    <div>
      <Header />
      <main className="book-reviews">
        <h1 className="book-reviews__title">書籍レビュー一覧</h1>
        {errorMessage && <p className="book-reviews__error">{errorMessage}</p>}
        <ul className="book-reviews__list">
          {books.map((book) => (
            <li key={book.id} className="book-reviews__item">
              <h2 className="book-reviews__item-title">{book.title}</h2>
              <p className="book-reviews__item-review">{book.review}</p>
              <p className="book-reviews__item-reviewer">
                レビュー者: {book.reviewer}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};
