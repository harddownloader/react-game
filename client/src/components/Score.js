import React, {
  // useRef,
  // useState,
  // useEffect,
  useContext,
  // useMemo,
  // useReducer,
} from 'react';

import { AppContext } from '../App';

function Score() {
  const { score } = useContext(AppContext);

  return (
    <>
      <div id="score">{score}</div>
    </>
  );
}

export default Score;
