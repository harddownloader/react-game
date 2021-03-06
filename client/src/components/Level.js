import React, { useContext, useEffect } from 'react';

import { AppContext } from '../App';

function Level(props) {
  const { level, score } = useContext(AppContext);

  useEffect(() => {
    const needLvlScore = 1000;
    const needLvl = 1;
    if(score > needLvlScore) {
      props.changeLevel(needLvl+1)
    } else if(score > needLvlScore*2) {
      props.changeLevel(needLvl+2)
    } else if(score > needLvlScore*3) {
      props.changeLevel(needLvl+3)
    } else if(score > needLvlScore*4) {
      props.changeLevel(needLvl+4)
    } else if(score > needLvlScore*5) {
      props.changeLevel(needLvl+5)
    }

  }, [score]);

  

  return (
    <>
      <div id="level">{level} LvL</div>
    </>
  );
}

export default Level;
