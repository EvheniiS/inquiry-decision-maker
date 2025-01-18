import React, { useState } from 'react';

const TestComponent = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold text-blue-500">
        Environment Test Component
      </h2>
      
      <p className="text-gray-600">
        Testing Tailwind CSS and React functionality
      </p>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCount(prev => prev - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          -
        </button>
        
        <span className="text-2xl font-bold">{count}</span>
        
        <button
          onClick={() => setCount(prev => prev + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          +
        </button>
      </div>
      
      <div className="text-sm text-gray-500">
        Features working if you see:
        <ul className="list-disc list-inside">
          <li>Styled components (Tailwind)</li>
          <li>Interactive counter (React state)</li>
          <li>Hover effects (Tailwind transitions)</li>
          <li>Centered layout (Flexbox)</li>
        </ul>
      </div>
    </div>
  );
};

export default TestComponent;