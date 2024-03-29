import React, {
  // useRef,
  // useState,
  // useEffect,
  useContext,
  // useMemo,
  // useReducer,
} from 'react';

import { AppContext } from '../App';

function Lifes() {
  const { lifesCount } = useContext(AppContext);

  const lifesList = [];

  for (let i = 0; i < lifesCount; i++) {
    lifesList.push(<div id="life" key={i}></div>);
  }

  return (
    <>
      <div id="lifes">{lifesList}</div>
    </>
  );
}

export default Lifes;
