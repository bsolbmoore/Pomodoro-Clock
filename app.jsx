const { useState, useEffect, useRef } = React;

const PomodoroClock = () => {
  // Default settings
  const DEFAULT_BREAK = 5;
  const DEFAULT_SESSION = 25;
  
  // State
  const [breakLength, setBreakLength] = useState(DEFAULT_BREAK);
  const [sessionLength, setSessionLength] = useState(DEFAULT_SESSION);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SESSION * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  
  // Refs
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle break decrement
  const decrementBreak = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
      if (timerLabel === 'Break' && !isRunning) {
        setTimeLeft((breakLength - 1) * 60);
      }
    }
  };
  
  // Handle break increment
  const incrementBreak = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
      if (timerLabel === 'Break' && !isRunning) {
        setTimeLeft((breakLength + 1) * 60);
      }
    }
  };
  
  // Handle session decrement
  const decrementSession = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (timerLabel === 'Session' && !isRunning) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };
  
  // Handle session increment
  const incrementSession = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (timerLabel === 'Session' && !isRunning) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };
  
  // Toggle timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  // Reset timer
  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setBreakLength(DEFAULT_BREAK);
    setSessionLength(DEFAULT_SESSION);
    setTimerLabel('Session');
    setTimeLeft(DEFAULT_SESSION * 60);
    setIsSession(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            if (audioRef.current) audioRef.current.play();
            if (isSession) {
              setTimerLabel('Break');
              setIsSession(false);
              return breakLength * 60;
            } else {
              setTimerLabel('Session');
              setIsSession(true);
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isSession, breakLength, sessionLength]);
  
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);
  
  return (
    <div className="container">
      <div id="clock">
        <div className="title">
          <h1>Pomodoro Clock</h1>
          <p className="subtitle">25 + 5 Productivity Timer</p>
        </div>
        
        <div className="settings">
          <div className="length-control">
            <label id="break-label">Break Length</label>
            <div className="control-container">
              <button id="break-decrement" className="btn-control" onClick={decrementBreak}>
                <i className="fas fa-arrow-down"></i>
              </button>
              <div id="break-length">{breakLength}</div>
              <button id="break-increment" className="btn-control" onClick={incrementBreak}>
                <i className="fas fa-arrow-up"></i>
              </button>
            </div>
          </div>
          
          <div className="length-control">
            <label id="session-label">Session Length</label>
            <div className="control-container">
              <button id="session-decrement" className="btn-control" onClick={decrementSession}>
                <i className="fas fa-arrow-down"></i>
              </button>
              <div id="session-length">{sessionLength}</div>
              <button id="session-increment" className="btn-control" onClick={incrementSession}>
                <i className="fas fa-arrow-up"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="timer-container">
          <div id="timer-label">{timerLabel}</div>
          <div id="time-left">{formatTime(timeLeft)}</div>
          
          <div className="timer-controls">
            <button id="start_stop" className="btn-timer" onClick={toggleTimer}>
              <i className={`fas fa-${isRunning ? 'pause' : 'play'}`}></i>
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button id="reset" className="btn-timer" onClick={resetTimer}>
              <i className="fas fa-sync-alt"></i>
              Reset
            </button>
          </div>
        </div>
        
        <audio 
          id="beep" 
          ref={audioRef}
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
        
        <div className="footer">
          <p>Pomodoro Clock | Created for freeCodeCamp Project</p>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<PomodoroClock />, document.getElementById('app'));
