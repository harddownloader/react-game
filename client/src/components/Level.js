import React, { useContext, useEffect } from 'react';

import { AppContext } from '../App';

function Level(props) {
  const { level, scoreCount } = useContext(AppContext);

  useEffect(() => {
    // console.log('level score')
    const needLvlScore = 300;
    if(scoreCount >= needLvlScore && scoreCount <= needLvlScore*2) {
      // props.changeLevel(level+1)
    } else if(scoreCount >= needLvlScore*2 && scoreCount <= needLvlScore*3) {
      // props.changeLevel(level+1)
    } else if(scoreCount >= needLvlScore*3 && scoreCount <= needLvlScore*4) {
      props.changeLevel(level+1)
    } else if(scoreCount >= needLvlScore*4 && scoreCount <= needLvlScore*5) {
      props.changeLevel(level+1)
    } else if(scoreCount >= needLvlScore*5 && scoreCount <= needLvlScore*6) {
      props.changeLevel(level+1)
    }

  }, [scoreCount]);



  return (
    <>
      <div id="level">{level} LvL</div>
    </>
  );
}

export default Level;
