import React, { useRef, useState, useEffect, useContext, useMemo, useReducer } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}



// Timer component
function Timer({pause}) {
  const [hour, setHours] = useState(0);
  const [minute, setMinutes] = useState(0);
  const [second, setSeconds] = useState(0);

  const toTime = (time) => ("0" + time).slice(-2);
  
  let resetRef = useRef();
  // Trick to Intialize countRef.current on first render only.
  resetRef.current = resetRef.current || false; 
  
  useEffect(() => {
    if (resetRef.current === true) {
      setSeconds(0);
    }
  });
  
  useInterval(()=> {
    if (pause) {
      resetRef.current = true;
      return;
    }
    resetRef.current = false;
    setSeconds(second + 1);
  }, pause ? null : 1000);

  useInterval(()=> {
    if (pause) {
       resetRef.current = true;
       return;
    }
    resetRef.current = false;
    setSeconds(0);
    setMinutes(minute + 1);
  }, pause ? null : 1000 * 60);

  useInterval(()=> {
   if (pause) {
       resetRef.current = true;
       return;
    }  
    setSeconds(0);
    setMinutes(0);
    setHours(hour + 1);
  }, pause ? null :  1000 * 60 * 60);

  return (
    <div className="timer">
      <span>TIME:</span> <span>{toTime(hour)}:</span>
      <span>{toTime(minute)}:</span>
      <span>{toTime(second)}</span>
    </div>
  );
}


function initState () {
  const grid = initGrid();
  return {
    grid,
    snake: {
      head: {
        row: 5,
        col: 9,
      },
      tail:[],
    },
    food: {
      row: Math.floor(Math.random() * 5),
      col: Math.floor(Math.random() * 5),
    },
    score: 0,
    showGrid: true,
    lost: false,
    message: 'Press <space> or touch/click to start the game',
    inprogress: false,
  }
}

function initGrid () {
  const grid = [];
  for (let row = 0; row <20; row++) {
    const cols = [];
    for (let col = 0; col < 20; col ++) {  
      cols.push({
        row,
        col
      });
    }
    grid.push(cols);  
  }
  return grid;
}

const random = () => {
  return Math.random(); 
};

// Lets create KEYS constant for tracking movement
const Keys = {
  Space: 32,
  Left: 37,
  Up: 38,
  Right: 39,
  Down: 40,
  a: 65,  // left
  w: 87,  // up
  s: 83,  // down
  d: 68   // right
}

// Default move the snake to the right
var move = Keys.Right;

const reducer = (state, action) => {
  switch (action.type) {
    case 'game_lost':
      return {
        ...state,
        showGrid: state.showGrid,
        lost: true,
        message: 'Press <space> or touch/click to start the game',
        inprogress: false,  // Used in Timer
      }
    case 'update':
      console.log(action.newstate); 
      return {
        ...state,
        ...action.newstate
      }
      
    case 'toggle_grid':
      return {
        ...state,
        showGrid: !state.showGrid
      };
      
    case 'restart':
      let newState = {
        ...state,
        message: 'Game in progress ☝',
        inprogress: true,
        lost: false,
        snake: {
          ...state.snake,
          head: {
            row: Math.floor(random() * 5),
            col: Math.floor(random() * 5),
          },
          tail: [],
        }
      }
      return newState;
    default: {
     return state;
    }
  }
};