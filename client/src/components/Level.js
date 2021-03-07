import React, { useContext, useEffect } from 'react';

import { AppContext } from '../App';

function Level(props) {
  const { level, score } = useContext(AppContext);

  useEffect(() => {
    // console.log('level score')
    const needLvlScore = 300;
    if(score >= needLvlScore && score <= needLvlScore*2) {
      // props.changeLevel(level+1)
    } else if(score >= needLvlScore*2 && score <= needLvlScore*3) {
      // props.changeLevel(level+1)
    } else if(score >= needLvlScore*3 && score <= needLvlScore*4) {
      props.changeLevel(level+1)
    } else if(score >= needLvlScore*4 && score <= needLvlScore*5) {
      props.changeLevel(level+1)
    } else if(score >= needLvlScore*5 && score <= needLvlScore*6) {
      props.changeLevel(level+1)
    }

  }, [score]);



  return (
    <>
      <div id="level">{level} LvL</div>
    </>
  );
}

export default Level;
