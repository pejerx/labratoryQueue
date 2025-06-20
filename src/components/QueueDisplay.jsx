import React from 'react';
import './QueueDisplay.css';

const QueueDisplay = ({ currentNumber }) => {
  const display = currentNumber
    ? String(currentNumber).padStart(4, '0')
    : '----';

  return (
    <div className="queue-display">
      <h2>Now Serving</h2>
      <div className="number">{display}</div>
    </div>
  );
};

export default QueueDisplay;
