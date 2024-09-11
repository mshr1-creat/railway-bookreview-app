// BookList.jsx
import React from 'react';
import '../pages/bookReviews.scss'; // BEMのクラス設計に基づいたCSS
import PropTypes from 'prop-types';

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

// PropTypesを追加
BookList.propTypes = {
  books: PropTypes.number.isRequired,
};

export default BookList;
