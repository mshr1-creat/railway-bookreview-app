// EditReview.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Header } from '../components/Header';
import { url } from '../const';
import './editReview.scss';

export const EditReview = () => {
  const { id } = useParams(); // URLから書籍IDを取得
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: '',
    url: '',
    detail: '',
    review: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 初期データの取得
  useEffect(() => {
    if (!cookies.token) {
      navigate('/login');
      return;
    }

    // 書籍情報を取得
    axios
      .get(`${url}/books/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        if (!res.data.isMine) {
          // 自分の投稿でない場合はアクセスを禁止
          setErrorMessage('このレビューを編集する権限がありません。');
          setLoading(false);
          return;
        }
        setBook({
          title: res.data.title,
          url: res.data.url,
          detail: res.data.detail,
          review: res.data.review,
        });
        setLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`書籍情報を取得できませんでした。${err.message}`);
        setLoading(false);
        console.error('Error fetching book details:', err);
      });
  }, [id, cookies.token, navigate]);

  // フォームの入力ハンドラー
  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  // フォームの送信ハンドラー
  const handleSubmit = (e) => {
    e.preventDefault();

    // 書籍更新 API を呼び出す
    axios
      .put(
        `${url}/books/${id}`,
        {
          title: book.title,
          url: book.url,
          detail: book.detail,
          review: book.review,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      .then(() => {
        alert('レビューを更新しました。');
        navigate(`/detail/${id}`);
      })
      .catch((err) => {
        setErrorMessage(`レビューの更新に失敗しました。${err.message}`);
        console.error('Error updating review:', err);
      });
  };

  // レビューの削除ハンドラー
  const handleDelete = () => {
    if (window.confirm('本当にこのレビューを削除しますか？')) {
      // 書籍削除 API を呼び出す
      axios
        .delete(`${url}/books/${id}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        })
        .then(() => {
          alert('レビューを削除しました。');
          navigate('/');
        })
        .catch((err) => {
          setErrorMessage(`レビューの削除に失敗しました。${err.message}`);
          console.error('Error deleting review:', err);
        });
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <p>読み込み中...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div>
        <Header />
        <p>{errorMessage}</p>
        <Link to="/">ホームに戻る</Link>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="edit-review">
        <h2>レビューの編集</h2>
        <form onSubmit={handleSubmit} className="edit-review__form">
          <div className="edit-review__field">
            <label htmlFor="title">タイトル</label>
            <input
              type="text"
              id="title"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="edit-review__field">
            <label htmlFor="url">URL</label>
            <input
              type="url"
              id="url"
              name="url"
              value={book.url}
              onChange={handleChange}
            />
          </div>
          <div className="edit-review__field">
            <label htmlFor="detail">詳細</label>
            <textarea
              id="detail"
              name="detail"
              value={book.detail}
              onChange={handleChange}
            />
          </div>
          <div className="edit-review__field">
            <label htmlFor="review">レビュー</label>
            <textarea
              id="review"
              name="review"
              value={book.review}
              onChange={handleChange}
              required
            />
          </div>
          <div className="edit-review__buttons">
            <button type="submit">更新</button>
            <button type="button" onClick={handleDelete}>
              削除
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </main>
    </div>
  );
};
