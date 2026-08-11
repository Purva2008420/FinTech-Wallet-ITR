import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-4">

      <button
        className="btn btn-outline-primary"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>

      <span className="fw-bold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="btn btn-outline-primary"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>

    </div>
  );
};

export default Pagination;