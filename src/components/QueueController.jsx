import React from 'react';

const QueueController = ({ onAdd, onAssign, onReset }) => (
  <div className="controller">
    <button onClick={onAdd}>Add Customer</button>
    <button onClick={onAssign}>Assign Customer</button>
    <button onClick={onReset}>Reset</button>
  </div>
);

export default QueueController;
