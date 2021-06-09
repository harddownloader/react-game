import React from 'react';

import useInterval from '../utils/useInterval'
import getRandomArbitrary from '../utils/generateRandomNumberArbitrary';
import doElsCollide from '../utils/isElementOnAnoterElement';
import {AppContext} from '../App'


function Boss(props) {

  const {bullets, lifeValue, gameDifficultyVariables, score, isSounds} = useContext(AppContext)

  useInterval(() => {
    
  }, 500);

  return (
    <>
      <div className="boss" style={{ top: `${props.y}px`, left: `${props.x}px` }}></div>
    </>
  )
}

export default Boss;
