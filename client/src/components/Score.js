import React, { useRef, useState, useEffect, useContext } from 'react';

import {AppContext} from '../App'

function Score() {
  const {scoreCount} = useContext(AppContext)

  return (
    <>
      <div id="score">{ scoreCount }</div>
    </>
  );
}

export default Score;
