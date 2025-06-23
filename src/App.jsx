import React, { useState } from 'react';
import './App.css';
import useQueue from './hooks/useQueue';

function App() {
  const {
    waitingQueue,
    addCustomer,
    assignCustomer,
    assignAllCustomers,
    resetQueue,
    removeFromQueue,
    priorityServing,
    regular1Serving,
    regular2Serving,
    priorityQueue,
    regular1Queue,
    regular2Queue,
  } = useQueue();

  const formatNumber = (num) => String(num).padStart(4, '0');

  const [showAllWaiting, setShowAllWaiting] = useState(false);
  const [showAllPriority, setShowAllPriority] = useState(false);
  const [showAllReg1, setShowAllReg1] = useState(false);
  const [showAllReg2, setShowAllReg2] = useState(false);

  const renderNowServing = (cust) =>
    cust ? (
      <div className="now-serving">
        Now Serving: Customer {formatNumber(cust.number)} ⏳ {cust.timeLeft}s
      </div>
    ) : (
      <div className="now-serving">Idle</div>
    );

  const QueueList = ({ queue, showAll, setShowAll, limit = 2 }) => {
    const items = showAll ? queue : queue.slice(0, limit);

    return (
      <>
        {items.length ? (
          items.map((cust) => (
            <div
              key={cust.id}
              className={`queue-item ${cust.priority ? 'priority' : ''}`}
            >
              {formatNumber(cust.number)} | {cust.priority ? 'Priority' : 'Regular'}
              <button
                className="delete-btn"
                title="Remove"
                onClick={() => removeFromQueue(cust.id)}
              >
                x
              </button>
            </div>
          ))
        ) : (
          <p className="empty">Empty</p>
        )}
        {queue.length > limit && (
          <button className="see-toggle" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'See Less' : 'See 10'}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="App">
      <h1>Queue Monitor</h1>

      <div className="controller">
        <button onClick={addCustomer}>Add Customer</button>
        <button onClick={assignCustomer}>Assign Customer</button>
        <button onClick={assignAllCustomers}>Assign All</button>
        <button onClick={resetQueue}>Reset Queue</button>
      </div>

      <div className="main-content">
        <div className="waiting-queue">
          <h3>Waiting Queue</h3>
          <QueueList
            queue={waitingQueue}
            showAll={showAllWaiting}
            setShowAll={setShowAllWaiting}
          />
        </div>

        <div className="cashier-area">
          <div className="cashier">
            <h4>Priority Cashier</h4>
            {renderNowServing(priorityServing)}
            <h5>Queue:</h5>
            <QueueList
              queue={priorityQueue}
              showAll={showAllPriority}
              setShowAll={setShowAllPriority}
            />
          </div>

          <div className="cashier">
            <h4>Regular Cashier 1</h4>
            {renderNowServing(regular1Serving)}
            <h5>Queue:</h5>
            <QueueList
              queue={regular1Queue}
              showAll={showAllReg1}
              setShowAll={setShowAllReg1}
            />
          </div>

          <div className="cashier">
            <h4>Regular Cashier 2</h4>
            {renderNowServing(regular2Serving)}
            <h5>Queue:</h5>
            <QueueList
              queue={regular2Queue}
              showAll={showAllReg2}
              setShowAll={setShowAllReg2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
