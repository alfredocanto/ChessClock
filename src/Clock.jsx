import React, { useEffect } from 'react'
import { useState } from 'react'
import pauseGameSound from './assets/pauseGame.wav'
import resetGameSound from './assets/resetGame.wav'
import tacSound from './assets/tacSound.wav'
import runOutOfTime from './assets/runOutOfTime.wav'
import { presetTimes } from './config';
import ClockDisplay from './components/ClockDisplay'
import './Clock.css'
import {
  FaPause,
  FaClock,
  FaVolumeUp,
  FaUndo,
} from 'react-icons/fa'
import {
  FaPlay,
  FaVolumeXmark,
} from 'react-icons/fa6'


export default function Clock() {

  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(presetTimes[7]); // Default preset
  const [lastRunningClock, setLastRunningClock] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [sound, setSound] = useState(true);

  const initializeClock = () => ({
    initialTime: selectedPreset.time,
    currentTime: selectedPreset.time,
    isRunning: false,
    moves: 0,
    increment: selectedPreset.increment,
  });

  const [clock1, setClock1] = useState(initializeClock());
  const [clock2, setClock2] = useState(initializeClock());

  const toggleActiveClock = (clock) => {
    if (!gameOver) {
      if (!gameStarted) {
        setGameStarted(true);
        if (clock === 1) {
          setClock1({ ...clock1, isRunning: true });
          setLastRunningClock(1);
          setClock2({ ...clock2, isRunning: false });
          setGamePaused(false);
          sound ? playSound(tacSound) : null;
        } else if (clock === 2) {
          setClock2({ ...clock2, isRunning: true });
          setLastRunningClock(2);
          setClock1({ ...clock1, isRunning: false });
          setGamePaused(false);
          sound ? playSound(tacSound) : null;
        }
      } else if (clock === 1 && !clock1.isRunning) {
        setClock1({ ...clock1, isRunning: true });
        setLastRunningClock(1);
        setClock2({ ...clock2, isRunning: false, moves: clock2.moves + 1, currentTime: clock2.currentTime + clock2.increment });
        setGamePaused(false);
        sound ? playSound(tacSound) : null;
      } else if (clock === 2 && !clock2.isRunning) {
        setClock2({ ...clock2, isRunning: true });
        setLastRunningClock(2);
        setClock1({ ...clock1, isRunning: false, moves: clock1.moves + 1, currentTime: clock1.currentTime + clock1.increment });
        setGamePaused(false);
        sound ? playSound(tacSound) : null;
      }
    }
  }

  useEffect(() => {
    let timer
    if (clock1.isRunning && clock1.currentTime > 0) {
      timer = setInterval(() => {
        setClock1({ ...clock1, currentTime: clock1.currentTime - 1 });
      }, 100);
    } else if (clock1.currentTime === 0) {
      setGameOver(true);
      sound ? playSound(runOutOfTime) : null;
    }
    if (clock2.isRunning && clock2.currentTime > 0) {
      timer = setInterval(() => {
        setClock2({ ...clock2, currentTime: clock2.currentTime - 1 });
      }, 100);
    } else if (clock2.currentTime === 0) {
      setGameOver(true);
      sound ? playSound(runOutOfTime) : null;
    }
    return () => clearInterval(timer);

  }, [clock1.isRunning, clock1.currentTime, clock2.isRunning, clock2.currentTime])


  const formatTime = (milliseconds) => {
    const totalMilliseconds = milliseconds * 100; // Multiplicar por 100 para décimas de segundo
    const hours = Math.floor(totalMilliseconds / 3600000); // Obtener horas
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000); // Obtener minutos
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000); // Obtener segundos
    const tenths = Math.floor((totalMilliseconds % 1000) / 100); // Obtener décimas de segundo

    if (hours > 0) {
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      if (totalMilliseconds < 10000) {
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${tenths}`;
      } else {
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      }
    } else {
      const formattedMinutes = minutes.toString().padStart(1, "0");
      const formattedSeconds = seconds.toString().padStart(2, "0");

      if (totalMilliseconds < 10000) {
        return `${formattedMinutes}:${formattedSeconds}.${tenths}`;
      } else {
        return `${formattedMinutes}:${formattedSeconds}`;
      }
    }
  };

  const resetGame = () => {
    setShowResetModal(false); // Close the reset modal
    setClock1({ ...clock1, currentTime: selectedPreset.time, isRunning: false, moves: 0, increment: selectedPreset.increment, });
    setClock2({ ...clock2, currentTime: selectedPreset.time, isRunning: false, moves: 0, increment: selectedPreset.increment, });
    setGameStarted(false);
    setGameOver(false);
    setLastRunningClock(null);
    sound ? playSound(resetGameSound) : null;
  }

  const openResetModal = () => {
    setShowResetModal(true); // Show the reset modal when the reset button is clicked
  }

  const closeResetModal = () => {
    setShowResetModal(false); // Close the reset modal without resetting when canceled
  }

  const pauseGame = () => {
    if (clock1.isRunning || clock2.isRunning) {
      setClock1({ ...clock1, isRunning: false });
      setClock2({ ...clock2, isRunning: false });
      setGamePaused(true);
      sound ? playSound(pauseGameSound) : null;
    } else if (lastRunningClock === 1) {
      setClock1({ ...clock1, isRunning: true });
      setGamePaused(false);
      sound ? playSound(pauseGameSound) : null;
    } else if (lastRunningClock === 2) {
      setClock2({ ...clock2, isRunning: true });
      setGamePaused(false);
      sound ? playSound(pauseGameSound) : null;
    }
  }

  const openSettings = () => {
    setIsSettingsOpen(true);
  }

  const closeSettings = () => {
    setIsSettingsOpen(false);
  }

  const handleSelectedPreset = (preset) => {
    setSelectedPreset(preset);
  }

  const handleSaveSettings = () => {
    // Configure the clocks based on the selected preset
    setClock1({
      ...clock1,
      initialTime: selectedPreset.time,
      currentTime: selectedPreset.time,
      increment: selectedPreset.increment,
    });
    setClock2({
      ...clock2,
      initialTime: selectedPreset.time,
      currentTime: selectedPreset.time,
      increment: selectedPreset.increment,
    });
    resetGame(selectedPreset);
    setGameStarted(false);
    setIsSettingsOpen(false);
  };

  function playSound(sound) {
    new Audio(sound).play();
  }

  const toggleSound = () => {
    setSound(!sound);
  }

  return (
    <>
      <ClockDisplay
        clock={clock1}
        onClick={() => toggleActiveClock(2)}
        gameStarted={gameStarted}
        gameOver={gameOver}
        formatTime={formatTime}
        isUpsideDown
      />
      <div className="controls">
        <FaUndo onClick={openResetModal} className="reset" />
        {gamePaused ? <FaPlay onClick={pauseGame} className="pause" /> : <FaPause onClick={pauseGame} className="pause" />}
        <FaClock onClick={openSettings} className="time-control" />
        {sound ? <FaVolumeUp onClick={toggleSound} className="sound" /> : <FaVolumeXmark onClick={toggleSound} className="sound" />}
      </div>
      <ClockDisplay
        clock={clock2}
        onClick={() => toggleActiveClock(1)}
        gameStarted={gameStarted}
        gameOver={gameOver}
        formatTime={formatTime}
      />
      {/* Dual settings modal*/}
      {
        isSettingsOpen && (
          <div className="settings" onClick={closeSettings}>
            <div className="settings-content" onClick={(e) => e.stopPropagation()}>
              <h2>Time Controls</h2>
              <div className="preset-buttons">
                {presetTimes.map((preset) => (
                  <button
                    key={preset.label}
                    className={preset === selectedPreset ? 'selected-preset' : ''}
                    onClick={() => handleSelectedPreset(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="settings-buttons">
                <button onClick={handleSaveSettings}>Save</button>
                <button onClick={closeSettings}>Cancel</button>
              </div>
            </div>
          </div>
        )
      }
      {/* Reset Confirmation Modal */}
      {
        showResetModal && (
          <div className="reset-modal">
            <div className="reset-modal-content">
              <p>Reset Clock</p>
              <div className="reset-modal-buttons">
                <button className="confirm" onClick={resetGame}>Confirm</button>
                <button className="cancel" onClick={closeResetModal}>Cancel</button>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}