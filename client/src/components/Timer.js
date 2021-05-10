import React from 'react';
import useInterval from '../utils/useInterval'
// import useStickyState from '../utils/useStickyState'

function Timer(props) {
  useInterval(() => {
    if(props.timerSec === 59) {
      props.setTimerSec(0)
      props.setTimerMin(props.timerMin+1)
    } else {
      props.setTimerSec(props.timerSec+1)
    }
  }, 1000);

  return(
    <>
     <p className="timer">{props.timerMin > 9 ? props.timerMin : `0${props.timerMin}`}:{props.timerSec > 9 ? props.timerSec : `0${props.timerSec}`}</p>
    </>
  )
}

export default Timer;
