// BookDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Header } from '../components/Header';
import { url } from '../const';
import './bookDetail.scss';

export const BookDetail = () => {
  const { id } = useParams(); // URLから書籍IDを取得
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // ローディング状態を管理

  useEffect(() => {
    if (!cookies.token) {
      // 認証トークンがない場合はログインページにリダイレクト
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
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMessage(`書籍の詳細を取得できませんでした。${err.message}`);
        setLoading(false);
        console.error('Error fetching book details:', err);
      });
  }, [id, cookies.token, navigate]);

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
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="book-detail">
        <h2>{book.title}</h2>
        <p>{book.detail}</p>
        <p>
          <a href={book.url} target="_blank" rel="noopener noreferrer">
            書籍情報を見る
          </a>
        </p>
        <h3>レビュー</h3>
        <p>{book.review}</p>
        <p>レビュアー: {book.reviewer}</p>
        {book.isMine && (
          <div className="book-detail__edit">
            <Link to={`/edit/${book.id}`}>編集する</Link>
          </div>
        )}
        <Link to={`/`}>戻る</Link>
      </main>
    </div>
  );
};
