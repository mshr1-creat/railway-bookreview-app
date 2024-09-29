// NewReview.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { url } from '../const';
import './newReview.scss';
import { Link } from 'react-router-dom';

export const NewReview = () => {
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

  // フォームの入力値を管理するステート
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [bookUrl, setBookUrl] = useState('');
  const [review, setReview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // フォームの送信処理
  const handleSubmit = (e) => {
    e.preventDefault();

    // バリデーションチェック
    if (!title || !detail || !bookUrl || !review) {
      setErrorMessage('すべての項目を入力してください。');
      return;
    }

    // 書籍投稿APIを呼び出す
    axios
      .post(
        `${url}/books`,
        {
          title,
          detail,
          url: bookUrl,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then(() => {
        // 投稿成功後、書籍一覧画面に遷移
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`投稿に失敗しました。${err.message}`);
        console.error('Error posting review:', err);
      });
  };

  return (
    <div>
      <Header />
      <main className="new-review">
        <h2>新しい書籍レビューを投稿</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="new-review-form" onSubmit={handleSubmit}>
          <label htmlFor="title">タイトル</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="detail">詳細</label>
          <textarea
            id="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
          />

          <label htmlFor="bookUrl">URL</label>
          <input
            type="url"
            id="bookUrl"
            value={bookUrl}
            onChange={(e) => setBookUrl(e.target.value)}
            required
          />

          <label htmlFor="review">レビュー</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />

          <button type="submit" className="submit-button">
            投稿
          </button>
          <Link to="/">戻る</Link>
        </form>
      </main>
    </div>
  );
};
