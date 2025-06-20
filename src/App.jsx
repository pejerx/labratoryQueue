import React from 'react';
import './App.css';
import useQueue from './hooks/useQueue';

function App() {
  const {
    waitingQueue,
    addCustomer,
    assignCustomer,
    resetQueue,
    priorityServing,
    regular1Serving,
    regular2Serving,
    priorityQueue,
    regular1Queue,
    regular2Queue,
  } = useQueue();

  // Format numbers like "0001", "0025", etc.
  const formatNumber = (num) => String(num).padStart(4, '0');

  // Displays the currently served customer with timer
  const renderNowServing = (cust) =>
    cust ? (
      <div className="now-serving">
        Now Serving: Customer {formatNumber(cust.number)} ⏳ {cust.timeLeft}s
      </div>
    ) : (
      <div className="now-serving">Idle</div>
    );

  // Displays a list of queued customers below the cashier
  const renderQueue = (queue) => {
    if (!Array.isArray(queue)) return <p className="empty">Queue not available</p>;

    return queue.length ? (
      queue.map((cust) => (
        <div
          key={cust.id}
          className={`queue-item ${cust.priority ? 'priority' : ''}`}
        >
          {formatNumber(cust.number)} | {cust.priority ? 'Priority' : 'Regular'}
        </div>
      ))
    ) : (
      <p className="empty">Empty</p>
    );
  };

  return (
    <div className="App">
      <h1>Queue Monitor</h1>

      <div className="controller">
        <button onClick={addCustomer}>Add Customer</button>
        <button onClick={assignCustomer}>Assign Customer</button>
        <button onClick={resetQueue}>Reset Queue</button>
      </div>

      <div className="main-content">
      
        <div className="waiting-queue">
          <h3>Waiting Queue</h3>
          {renderQueue(waitingQueue)}
        </div>

        {/* Cashiers */}
        <div className="cashier-area">
          <div className="cashier">
            <h4>Priority Cashier</h4>
            {renderNowServing(priorityServing)}
            <h5>Queue:</h5>
            {renderQueue(priorityQueue)}
          </div>

          <div className="cashier">
            <h4>Regular Cashier 1</h4>
            {renderNowServing(regular1Serving)}
            <h5>Queue:</h5>
            {renderQueue(regular1Queue)}
          </div>

          <div className="cashier">
            <h4>Regular Cashier 2</h4>
            {renderNowServing(regular2Serving)}
            <h5>Queue:</h5>
            {renderQueue(regular2Queue)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
