import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useMemo,
  useReducer,
} from 'react';

// utils
import useInterval from '../utils/useInterval';
import getRandomArbitrary from '../utils/generateRandomNumberArbitrary';
import useStickyState from '../utils/useStickyState'


// context
// import {AppContext} from '../App'


const Enemy = props => {
  // const {enemyes, bullets} = useContext(AppContext)

  const EnemyY = props.y;
  const EnemyX = props.x;
  const EmenyType = props.type;
  const { idComponent } = props;

  // координаты выстрела
  const [posEnemyX, setPosEnemyX] = useStickyState(EnemyX, 'posEnemyX');
  const [posEnemyY, setPosEnemyY] = useStickyState(EnemyY, 'posEnemyY');

  useEffect(() => {
    // console.log('new Y Enemy');
    setPosEnemyY(EnemyY);
  }, [EnemyY]);

  useEffect(() => {
    // console.log('new X Enemy');
    setPosEnemyX(EnemyX);
  }, [EnemyX]);


  // цикл анимации движения врага
  useInterval(() => {

    const outSideY = window.innerHeight + 10;
    // если выстрел ушел за горизонт - удаляем его
    if (posEnemyY > outSideY) {
      props.unmountMe(idComponent);
    }

    setPosEnemyY(posEnemyY + 2);
    // случайны "+" или "-", от случайного числа
    const getBooleanPlusOrMinus = getRandomArbitrary(0, 1);
    if (getBooleanPlusOrMinus) {
      // если true - то + 3px
      setPosEnemyX(posEnemyX + getRandomArbitrary(0, 3));
    } else {
      // если false - то - 3px
      setPosEnemyX(posEnemyX - getRandomArbitrary(0, 3));
    }
  }, 50);

  return (
    <>
      <div
        className={`enemy enemy-type-${EmenyType}`}
        id={`${idComponent}EnemyNo`}
        style={{ top: `${posEnemyY}px`, left: `${posEnemyX}px` }}
      ></div>
    </>
  );
};

export default Enemy;
