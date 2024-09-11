// Pagination.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, hasNextPage, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        className="pagination__button"
        onClick={() => onPageChange('prev')}
        disabled={currentPage === 1}
      >
        前へ
      </button>
      <span className="pagination__info">ページ {currentPage}</span>
      <button
        className="pagination__button"
        onClick={() => onPageChange('next')}
        disabled={!hasNextPage}
      >
        次へ
      </button>
    </div>
  );
};

// PropTypesを追加
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired, // currentPageは数値で必須
  hasNextPage: PropTypes.bool.isRequired, // hasNextPageはブール型で必須
  onPageChange: PropTypes.func.isRequired, // onPageChangeは関数で必須
};

export default Pagination;
