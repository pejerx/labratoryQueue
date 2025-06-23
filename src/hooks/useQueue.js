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
    localStorage.setItem('lastIssued', newNumber.toString());
  };

  const assignCustomer = () => {
    if (waitingQueue.length === 0) return;

    const [next, ...rest] = waitingQueue;
    setWaitingQueue(rest);

    const customerWithTimer = { ...next, timeLeft: 5 };

    if (next.priority) {
      if (!priorityServing) {
        setPriorityServing(customerWithTimer);
      } else if (!regular1Serving) {
        setRegular1Serving(customerWithTimer);
      } else if (!regular2Serving) {
        setRegular2Serving(customerWithTimer);
      } else {
        setPriorityQueue((prev) => [...prev, customerWithTimer]);
      }
    } else {
      const reg1Load = regular1Serving ? regular1Queue.length + 1 : 0;
      const reg2Load = regular2Serving ? regular2Queue.length + 1 : 0;

      if (!regular1Serving || reg1Load <= reg2Load) {
        if (!regular1Serving) {
          setRegular1Serving(customerWithTimer);
        } else {
          setRegular1Queue((prev) => [...prev, customerWithTimer]);
        }
      } else {
        if (!regular2Serving) {
          setRegular2Serving(customerWithTimer);
        } else {
          setRegular2Queue((prev) => [...prev, customerWithTimer]);
        }
      }
    }
  };

  const assignAllCustomers = () => {
    setWaitingQueue((prev) => {
      let remaining = [...prev];

      if (!priorityServing) {
        const index = remaining.findIndex((c) => c.priority);
        if (index !== -1) {
          const next = remaining.splice(index, 1)[0];
          setPriorityServing({ ...next, timeLeft: 5 });
        }
      }

      if (!regular1Serving) {
        const index = remaining.findIndex((c) => !c.priority);
        if (index !== -1) {
          const next = remaining.splice(index, 1)[0];
          setRegular1Serving({ ...next, timeLeft: 5 });
        }
      }

      if (!regular2Serving) {
        const index = remaining.findIndex((c) => !c.priority);
        if (index !== -1) {
          const next = remaining.splice(index, 1)[0];
          setRegular2Serving({ ...next, timeLeft: 5 });
        }
      }

      const priorityList = remaining.filter((c) => c.priority);
      const regularList = remaining.filter((c) => !c.priority);

      setPriorityQueue((prev) => [...prev, ...priorityList]);

      const half = Math.ceil(regularList.length / 2);
      setRegular1Queue((prev) => [...prev, ...regularList.slice(0, half)]);
      setRegular2Queue((prev) => [...prev, ...regularList.slice(half)]);

      return [];
    });
  };

  const removeFromQueue = (id) => {
    setWaitingQueue((prev) => prev.filter((c) => c.id !== id));
    setPriorityQueue((prev) => prev.filter((c) => c.id !== id));
    setRegular1Queue((prev) => prev.filter((c) => c.id !== id));
    setRegular2Queue((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (priorityServing) {
        if (priorityServing.timeLeft <= 1) {
          if (priorityQueue.length > 0) {
            const [next, ...rest] = priorityQueue;
            setPriorityQueue(rest);
            setPriorityServing({ ...next, timeLeft: 5 });
          } else {
            setPriorityServing(null);
          }
        } else {
          setPriorityServing((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
        }
      }

      // Regular 1
      if (regular1Serving) {
        if (regular1Serving.timeLeft <= 1) {
          if (regular1Queue.length > 0) {
            const [next, ...rest] = regular1Queue;
            setRegular1Queue(rest);
            setRegular1Serving({ ...next, timeLeft: 5 });
          } else {
            setRegular1Serving(null);
          }
        } else {
          setRegular1Serving((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
        }
      }

      // Regular 2
      if (regular2Serving) {
        if (regular2Serving.timeLeft <= 1) {
          if (regular2Queue.length > 0) {
            const [next, ...rest] = regular2Queue;
            setRegular2Queue(rest);
            setRegular2Serving({ ...next, timeLeft: 5 });
          } else {
            setRegular2Serving(null);
          }
        } else {
          setRegular2Serving((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [priorityServing, regular1Serving, regular2Serving, priorityQueue, regular1Queue, regular2Queue]);

  const resetQueue = () => {
    setWaitingQueue([]);
    setPriorityServing(null);
    setRegular1Serving(null);
    setRegular2Serving(null);
    setPriorityQueue([]);
    setRegular1Queue([]);
    setRegular2Queue([]);
    setLastIssued(0);
    localStorage.removeItem('lastIssued');
  };

  return {
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
  };
};

export default useQueue;
