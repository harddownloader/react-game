import React, {
  // useRef,
  // useState,
  // useEffect,
  // useContext,
  // useMemo,
  // useReducer,
} from 'react';

// import {AppContext} from '../App'

// задний фон
function Space(props) {
  return (
    <>
      <div className={`sky sky-${props.spaceType}`}></div>
    </>
  );
}

export default Space;
