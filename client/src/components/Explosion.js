import React, { useRef, useState, useEffect, useContext, useMemo, useReducer } from 'react';

import useInterval from '../utils/useInterval';


function Explosion(props) {
  const ExplosionX = props.x;
  const ExplosionY = props.y;
  
  const [posExplosionX, setPosExplosionX] = useState(ExplosionX);
  const [posExplosionY, setPosExplosionY] = useState(ExplosionY);


  // тип картинки
  const [type, setType] = useState(1)
  const changeType = (newScore) => setType(prev => newScore);

  useInterval(() => {
    // setFlag(flag + 1);
    // console.log('flag', flag);
    if(type < 3) {
      changeType(type+1)
    } else {
      // когда анимация взрыва закончилась - то удаляем компонент
      props.unmountMe()
    }
    
    
    
  }, 100);
  return (
    <>
      <div className={`explosion explosion-part-${type}`} style={{top: posExplosionY + 'px', left: posExplosionX + 'px'}}></div>
      {/* <div className={`explosion explosion-part-2`} style={{top: '200' + 'px', left: '300' + 'px'}}></div> */}
      {/* <div className={`explosion explosion-part-3`} style={{top: '150' + 'px', left: '300' + 'px'}}></div> */}
    </>
  )
}

export default Explosion;
