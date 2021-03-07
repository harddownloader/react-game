import React, {
  // useRef,
  useState,
  // useEffect,
  // useContext,
  // useMemo,
  // useReducer,
} from 'react';

import useInterval from '../utils/useInterval';
// import useStickyState from '../utils/useStickyState'

function Explosion(props) {
  // console.log('Explosion render')
  // const ExplosionX = props.x;
  // const ExplosionY = props.y;

  // const [posExplosionX, setPosExplosionX] = useStickyState(ExplosionX, 'posExplosionX');
  // const [posExplosionY, setPosExplosionY] = useStickyState(ExplosionY, 'posExplosionY');

  // тип картинки
  const [typeExplosion, setTypeExplosion] = useState(1);
  const changeTypeExplosion = newScore => setTypeExplosion(prev => newScore);

  useInterval(() => {
    // setFlag(flag + 1);
    // console.log('flag', flag);
    if (typeExplosion < 3) {
      changeTypeExplosion(typeExplosion + 1);
    } else {
      // ставинем неверный тип чтобы он быстрее скрылся, а не "ждал" доп.ренгера для удаления
      // changeTypeExplosion(typeExplosion + 1);
      // когда анимация взрыва закончилась - то удаляем компонент
      props.unmountMe();
    }
  }, 100);
  return (
    <>
      <div
        className={`explosion explosion-part-${typeExplosion}`}
        style={{ top: `${props.y}px`, left: `${props.x}px` }}
      ></div>
      {/* <div className={`explosion explosion-part-2`} style={{top: '200' + 'px', left: '300' + 'px'}}></div> */}
      {/* <div className={`explosion explosion-part-3`} style={{top: '150' + 'px', left: '300' + 'px'}}></div> */}
    </>
  );
}

export default Explosion;
