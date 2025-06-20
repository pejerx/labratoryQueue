import React from 'react';

const WaitingQueueBox = ({ queue }) => (
  <div className="waiting-box">
    <h3>Waiting Queue</h3>
    <div>
      {queue.length > 0
        ? queue.map(n => (
            <div key={n}>{String(n).padStart(4, '0')}</div>
          ))
        : <p>No one waiting</p>}
    </div>
  </div>
);

export default WaitingQueueBox;
