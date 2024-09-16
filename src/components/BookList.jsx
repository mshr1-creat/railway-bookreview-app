// BookList.jsx
import React from 'react';
import '../pages/bookReviews.scss'; // BEMのクラス設計に基づいたCSS
import PropTypes from 'prop-types';

// books配列をmap関数で反復し、各書籍の情報をリストアイテムとして表示する
const BookList = ({ books }) => {
  return (
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
  );
};

// PropTypesを追加 プロパティの型チェックを行うため。
BookList.propTypes = {
  books: PropTypes.array.isRequired,
};

export default BookList;
