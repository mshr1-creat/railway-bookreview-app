import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Header } from '../components/Header';
import BookList from '../components/BookList';
import Pagination from '../components/Pagination'; // ページ遷移用の機能
import { url } from '../const';
import './bookReviews.scss'; // BEMのクラス設計に基づいたCSS

export const Home = () => {
  const [books, setBooks] = useState([]); // 書籍レビューのデータを保持する状態 初期値は空の配列を設定
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // 現在のページ
  const [hasNextPage, setHasNextPage] = useState(false); // 次のページが存在するか
  const [cookies] = useCookies(); // クッキーからトークンを取得する cookies.token にトークンが保存されている
  const itemsPerPage = 10; // 1ページに表示する件数
  const navigate = useNavigate();

  // コンポーネントがレンダリングされた際に一度だけ実行される
  useEffect(() => {
    const offset = (currentPage - 1) * itemsPerPage;

    // トークンが存在しない場合でも公開APIを使ってデータを取得する
    const endpoint = cookies.token
      ? `${url}/books?offset=${offset}`
      : `${url}/public/books?offset=${offset}`;
    const headers = cookies.token
      ? { Authorization: `Bearer ${cookies.token}` }
      : {};

    // 書籍レビューの先頭10件を取得
    axios
      .get(endpoint, {
        headers: headers,
      })
      .then((res) => {
        // console.log('API response data:', res.data); // 取得したデータを確認
        setBooks(res.data.slice(0, itemsPerPage)); // 現在のページのデータを設定
        setHasNextPage(res.data.length === itemsPerPage); // 次のページがあるかを判定
      })
      .catch((err) => {
        setErrorMessage(`書籍レビューの取得に失敗しました。${err.message}`);
        console.error(
          'Error fetching books:',
          err.response ? err.response.data : err.message
        );
      });
  }, [currentPage, cookies.token]);

  // console.log(cookies.token);

  // ページを変更する関数
  const handlePageChange = (direction) => {
    if (direction === 'next' && hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      <Header />
      <main className="book-reviews">
        <h1 className="book-reviews__title">書籍レビュー一覧</h1>
        {cookies.token && (
          <div className="new-review-link">
            <Link to="/new">新しいレビューを投稿する</Link>
          </div>
        )}
        {errorMessage && <p className="book-reviews__error">{errorMessage}</p>}
        <BookList books={books} />
        <Pagination
          currentPage={currentPage}
          hasNextPage={hasNextPage}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};
