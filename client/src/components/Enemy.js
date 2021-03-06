import React, {
  // useRef,
  // useState,
  // useEffect,
  // useContext,
  // useMemo,
  // useReducer,
} from 'react';

// utils
import useInterval from '../utils/useInterval';
import getRandomArbitrary from '../utils/generateRandomNumberArbitrary';
// import useStickyState from '../utils/useStickyState'


// context
// import {AppContext} from '../App'


const Enemy = props => {
  // const {enemyes, bullets} = useContext(AppContext)

  const EnemyY = props.y;
  const EnemyX = props.x;
  const EmenyType = props.type;
  const { idComponent } = props;

  // координаты выстрела
  // const [posEnemyX, setPosEnemyX] = useStickyState(EnemyX, 'posEnemyX');
  // const [posEnemyY, setPosEnemyY] = useStickyState(EnemyY, 'posEnemyY');

  // useEffect(() => {
  //   // console.log('new Y Enemy');
  //   setPosEnemyY(EnemyY);
  // }, [EnemyY]);

  // useEffect(() => {
  //   // console.log('new X Enemy');
  //   setPosEnemyX(EnemyX);
  // }, [EnemyX]);


  // цикл анимации движения врага
  useInterval(() => {
    
    const outSideY = window.innerHeight + 10;
    // если выстрел ушел за горизонт - удаляем его
    if (EnemyY > outSideY) {
      props.unmountMe(idComponent);
    }

    // setPosEnemyY(posEnemyY + 2);
    const needNewY = props.y + 20;
    
    // случайны "+" или "-", от случайного числа
    const getBooleanPlusOrMinus = getRandomArbitrary(0, 1);
    if (getBooleanPlusOrMinus) {
      // если true - то + 3px
      // setPosEnemyX(posEnemyX + getRandomArbitrary(0, 3));
      props.changeSpecialEnemy(idComponent, {
        x: (EnemyX + getRandomArbitrary(0, 60)),
        y: needNewY
      })
      // console.log('changeSpecialEnemy', {
      //   x: (EnemyX + getRandomArbitrary(0, 15)),
      //   y: needNewY
      // })
    } else {
      // если false - то - 3px
      // setPosEnemyX(posEnemyX - getRandomArbitrary(0, 3));
      props.changeSpecialEnemy(idComponent, {
        x: (EnemyX - getRandomArbitrary(0, 60)),
        y: needNewY
      })
    }
  }, 500);

  return (
    <>
      <div
        className={`enemy enemy-type-${EmenyType}`}
        id={`${idComponent}EnemyNo`}
        style={{ top: `${EnemyY}px`, left: `${EnemyX}px` }}
      ></div>
    </>
  );
};

export default Enemy;
