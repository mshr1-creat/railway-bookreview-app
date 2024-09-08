import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Header } from '../components/Header';
import { url } from '../const';
import './bookReviews.scss'; // BEMのクラス設計に基づいたCSS

export const Home = () => {
  const [books, setBooks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 書籍レビューの先頭10件を取得
    axios
      .get(`${url}/books?offset=0`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setBooks(res.data.slice(0, 10)); // 先頭10件を取得
      })
      .catch((err) => {
        setErrorMessage(`書籍レビューの取得に失敗しました。${err.message}`);
      });
  }, []);

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
