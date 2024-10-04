// BookList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/bookReviews.scss'; // BEMのクラス設計に基づいたCSS
import PropTypes from 'prop-types';

// books配列をmap関数で反復し、各書籍の情報をリストアイテムとして表示する
const BookList = ({ books, onBookClick }) => {
  return (
    <ul className="book-reviews__list">
      {books.map((book) => (
        <li key={book.id} className="book-reviews__item">
          <Link
            to={`/detail/${book.id}`}
            onClick={() => onBookClick(book.id)}
            className="book-reviews__link"
          >
            <h2 className="book-reviews__item-title">{book.title}</h2>
            <p className="book-reviews__item-review">{book.review}</p>
            <p className="book-reviews__item-reviewer">
              レビュー者: {book.reviewer}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

// PropTypesを追加 プロパティの型チェックを行うため。
BookList.propTypes = {
  books: PropTypes.array.isRequired,
  onBookClick: PropTypes.func.isRequired,
};

export default BookList;
