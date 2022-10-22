import React from 'react';
import './Pill.css';

function Pill({ text, pillColor }) {
  return (
    <div
      className="pill"
      style={{ backgroundColor: pillColor }}
    >
      {text}
    </div>
  );
}

export default Pill;
