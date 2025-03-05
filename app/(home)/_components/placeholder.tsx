import React from "react";

const Placeholder = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center h-64">
      <div className="text-gray-400 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v2"></path>
          <path d="M18.4 5.6l-1.4 1.4"></path>
          <path d="M21 12h-2"></path>
          <path d="M18.4 18.4l-1.4-1.4"></path>
          <path d="M12 19v2"></path>
          <path d="M5.6 18.4l1.4-1.4"></path>
          <path d="M3 12h2"></path>
          <path d="M5.6 5.6l1.4 1.4"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-700">No Product Scanned</h3>
      <p className="text-gray-500 mt-2 max-w-sm">
        Scan or upload a product to see its safety analysis report
      </p>
    </div>
  );
};

export default Placeholder;
