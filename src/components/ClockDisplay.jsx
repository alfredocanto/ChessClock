// ClockDisplay.js
import React from 'react';
import { FaSliders } from 'react-icons/fa6'; // Import the necessary icon

export default function ClockDisplay({ clock, onClick, gameStarted, gameOver, formatTime, isUpsideDown }) {
  return (
    <div onClick={onClick} className={`clock-container ${clock.isRunning ? 'running' : ''} ${gameOver && clock.currentTime === 0 ? 'rot' : ''} ${isUpsideDown ? 'reversed' : ''}`}>
      <p className="clock-moves">Moves: {clock.moves}</p>
      <h1 className="clock-timer">{formatTime(clock.currentTime)}</h1>
      {!gameStarted && <FaSliders className="clock-settings" />}
    </div>
  );
}
