import { useState, useEffect } from 'react';

const useQueue = () => {
  const initialNumber = parseInt(localStorage.getItem('lastIssued') || '0', 10);
  const [lastIssued, setLastIssued] = useState(initialNumber);
  const [waitingQueue, setWaitingQueue] = useState([]);

  const [priorityServing, setPriorityServing] = useState(null);
  const [regular1Serving, setRegular1Serving] = useState(null);
  const [regular2Serving, setRegular2Serving] = useState(null);

  const [priorityQueue, setPriorityQueue] = useState([]);
  const [regular1Queue, setRegular1Queue] = useState([]);
  const [regular2Queue, setRegular2Queue] = useState([]);

  const addCustomer = () => {
    if (lastIssued >= 100) return;

    const newNumber = lastIssued + 1;
    const isPriority = Math.random() < 0.4;

    const customer = {
      id: Date.now() + Math.random(),
      number: newNumber,
      priority: isPriority,
    };

    setWaitingQueue((prev) => [...prev, customer]);
    setLastIssued(newNumber);
    localStorage.setItem('lastIssued', newNumber);
  };

  const assignCustomer = () => {
    if (waitingQueue.length === 0) return;

    const [next, ...rest] = waitingQueue;
    setWaitingQueue(rest);

    const customerWithTimer = {
      ...next,
      timeLeft: next.priority ? 70 : 30,
    };

    if (next.priority) {
      if (!priorityServing) {
        setPriorityServing(customerWithTimer);
      } else {
        setPriorityQueue((prev) => [...prev, next]);
      }
    } else if (!regular1Serving || (regular1Queue.length <= regular2Queue.length)) {
      if (!regular1Serving) {
        setRegular1Serving(customerWithTimer);
      } else {
        setRegular1Queue((prev) => [...prev, next]);
      }
    } else {
      if (!regular2Serving) {
        setRegular2Serving(customerWithTimer);
      } else {
        setRegular2Queue((prev) => [...prev, next]);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (priorityServing) {
        setPriorityServing((prev) => {
          if (prev.timeLeft <= 1) {
            const next = priorityQueue[0];
            if (next) {
              const nextWithTimer = { ...next, timeLeft: 70 };
              setPriorityQueue((q) => q.slice(1));
              return nextWithTimer;
            }
            return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }

      if (regular1Serving) {
        setRegular1Serving((prev) => {
          if (prev.timeLeft <= 1) {
            const next = regular1Queue[0];
            if (next) {
              const nextWithTimer = { ...next, timeLeft: 30 };
              setRegular1Queue((q) => q.slice(1));
              return nextWithTimer;
            }
            return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }

      if (regular2Serving) {
        setRegular2Serving((prev) => {
          if (prev.timeLeft <= 1) {
            const next = regular2Queue[0];
            if (next) {
              const nextWithTimer = { ...next, timeLeft: 30 };
              setRegular2Queue((q) => q.slice(1));
              return nextWithTimer;
            }
            return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [priorityServing, regular1Serving, regular2Serving]);

  const resetQueue = () => {
    setWaitingQueue([]);
    setPriorityServing(null);
    setRegular1Serving(null);
    setRegular2Serving(null);
    setPriorityQueue([]);
    setRegular1Queue([]);
    setRegular2Queue([]);
  };

  return {
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
  };
};

export default useQueue;
