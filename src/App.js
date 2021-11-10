import './App.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp, faPlay, faPause, faSyncAlt  } from '@fortawesome/free-solid-svg-icons'

/* ICONS */

const arrowDown = <FontAwesomeIcon icon={faArrowDown} />
const arrowUp = <FontAwesomeIcon icon={faArrowUp} />
const arrowPlay = <FontAwesomeIcon icon={faPlay} />
const pause = <FontAwesomeIcon icon={faPause} />
const refresh = <FontAwesomeIcon icon={faSyncAlt} />


/* MAIN APP */

const beep = document.getElementById('beep');

class App extends React.Component {

  state = {
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 *60,
    currentTimer: 'Session',
    isPlaying: false
  }

  constructor(props) {
    super(props);
    this.loop = undefined;
  }

  componentWillUnmount() {
    clearInterval(this.loop);
  }
  
  handlePlay = () => {
    const { isPlaying } = this.state;
    
    if (isPlaying) {
      clearInterval(this.loop);
      this.setState({
        isPlaying: false
      });
    } else {
      this.setState({
        isPlaying: true
      })
      this.loop = setInterval(() => {
        const { clockCount, currentTimer, breakCount, sessionCount} = this.state;
        if (clockCount === 0) {
          this.setState({
            currentTimer: (currentTimer === 'Session') ? 'Break': 'Session',
            clockCount: (currentTimer === 'Session') ? (breakCount * 60): (sessionCount * 60) 
          });
          beep.play();
        } else {
          this.setState({
            clockCount: clockCount - 1
          });
        }
      }, 1000)
    }
  }

  handleRefresh = () => {
    this.setState({
    breakCount: 5,
    sessionCount: 25,
    clockCount: 25 * 60,
    currentTimer: 'Session',
    isPlaying: false
    });

    clearInterval(this.loop);

    beep.pause();
    beep.currentTime = 0;

  }

  convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;

    minutes = minutes < 10 ? '0' + minutes: minutes
    seconds = seconds < 10 ? '0' + seconds: seconds;

    return `${minutes}:${seconds}`;
  }

  handleTypeChange = (count, timerType) => {
    const { breakCount, sessionCount, currentTimer, isPlaying, clockCount} = this.state;

    let newCount;

    if (timerType === 'session') {
      newCount = sessionCount + count;
    } else {
      newCount = breakCount + count;
    }

    if (newCount > 0 && newCount < 61 && !isPlaying) {
      
        this.setState({
          [`${timerType}Count`]: newCount,
          clockCount: (currentTimer.toLowerCase() === timerType) ? newCount * 60 : clockCount
        });
      
    }

  }

  /* handleBreakDecrease = () => {
    const { breakCount, isPlaying, currentTimer } = this.state;

    if (breakCount > 1) {
      
      if (!isPlaying && currentTimer === 'Break') {
        this.setState({
          breakCount: breakCount - 1,
          clockCount: (breakCount - 1) * 60
        });
      } else {
        this.setState({
          breakCount: breakCount - 1
        });
      }
    }
  }

  handleBreakIncrease = () => {
    const { breakCount, isPlaying, currentTimer } = this.state;

    if (breakCount < 60) {

      if (!isPlaying && currentTimer === 'Break') {
        this.setState({
          breakCount: breakCount + 1,
          clockCount: (breakCount + 1) * 60
        });
      } else {
        this.setState({
          breakCount: breakCount + 1
        });
      }
    }
  }

  handleSessionDecrease = () => {
    const { sessionCount, isPlaying, currentTimer } = this.state;

    if (sessionCount > 1) {

      if (!isPlaying && currentTimer === 'Session') {
        this.setState({
          sessionCount: sessionCount - 1,
          clockCount: (sessionCount - 1) * 60
        });
      } else {
        this.setState({
          sessionCount: sessionCount - 1
        });
      }
    } 
  }

  handleSessionIncrease = () => {
    const { sessionCount, isPlaying, currentTimer } = this.state;

    if (sessionCount < 60) {
      if (!isPlaying && currentTimer === 'Session') {
        this.setState({
          sessionCount: sessionCount + 1,
          clockCount: (sessionCount + 1) * 60
        });
      } else {
        this.setState({
          sessionCount: sessionCount + 1
        });
      }
    }
  } */


  render() {

    const { breakCount,
            sessionCount,
            clockCount,
            currentTimer,
            isPlaying
      
          } = this.state;

    const breakProps = {
      title: 'Break',
      count: breakCount,
      handleDecrease: () => this.handleTypeChange(-1, 'break'),
      handleIncrease: () => this.handleTypeChange(1, 'break')
    }

    const sessionProps = {
      title: 'Session',
      count: sessionCount,
      handleDecrease: () => this.handleTypeChange(-1, 'session'),
      handleIncrease: () => this.handleTypeChange(1, 'session')
    }

    return (
      <div className="wrapper">
      <div className="title-container">
        <h2 className="title">POMODORO TIMER</h2>
      </div>
      <div className="time-length-control">
          <TimerLengthControl {...breakProps} />
          <TimerLengthControl {...sessionProps} />
      </div>
      
      <div className="timer">
        <h3 className="timer-title" id="timer-label">{currentTimer}</h3>
        <span className="clock" id="time-left">{this.convertToTime(clockCount)}</span>
      </div>
      <div className="timer-controls">
        <div className="control">
          <button id="start_stop" className="btn2" onClick={this.handlePlay}>
            {isPlaying ? pause: arrowPlay}
          </button>
        </div>
        <div className="control">
          <button id="reset" className="btn2" onClick={this.handleRefresh}>
            {refresh}
          </button>
        </div>
      </div>
    </div>
    )
  }
}

/* COMPONENTS */

const TimerLengthControl = (props) => {

  const id = props.title.toLowerCase();

  return (
    <div className="length-control">
      <h4 className="subtitle" id={`${id}-label`}>{props.title} Length</h4>
      <button className="btn-length" id={`${id}-decrement`} value='-' onClick={props.handleDecrease}>
      {arrowDown}
      </button>
      <span className="count" id={`${id}-length`}>{props.count}</span>
      <button className="btn-length" id={`${id}-increment`} value='+' onClick={props.handleIncrease}>
      {arrowUp}
      </button>
    </div>
    
  )
}


export default App;
