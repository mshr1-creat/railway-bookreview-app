// Pagination.jsx
import React from 'react';

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

export default Pagination;
