import React, {
  // useRef,
  // useState,
  // useEffect,
  useContext,
  // useMemo,
  // useReducer,
} from 'react';

// utils
import useInterval from '../utils/useInterval';
import getRandomArbitrary from '../utils/generateRandomNumberArbitrary';
// import useStickyState from '../utils/useStickyState'

import doElsCollide from '../utils/isElementOnAnoterElement';

// context
import {AppContext} from '../App'


const Enemy = props => {
  const {bullets, lifeValue, gameDifficultyVariables, score, isSounds} = useContext(AppContext)

  const EnemyY = props.y;
  const EnemyX = props.x;
  const EmenyType = props.type;
  const { idComponent } = props;

  const currentEnemy = document.getElementById(`${idComponent}EnemyNo`);
  useInterval(()=> {
    const bulletsTmp = bullets;
    // проверяем находятся ли выстрелы на месте врагов - если да, то убираем 2х и влюсуем очки
    for (let i = 0; i < bulletsTmp.length; i++) {
      const bulletEl = document.getElementById(`${bulletsTmp[i].id}BulletNo`);
      // console.log(bulletEl)
      if (currentEnemy && bulletEl) {
        const isHit = doElsCollide(currentEnemy, bulletEl);
        if (isHit) {
          // создаем взрыв
          props.didMountNewExplosion(currentEnemy.offsetLeft, currentEnemy.offsetTop);
          // удаляем наш выстрел
          props.unmountChildBullet(bulletsTmp[i].id);
          // удаляем врага
          // console.log('after currentEnemy', idComponent)
          props.unmountChildEnemy(idComponent);
          // добавляем нам очков
          console.log('score = ', score )
          props.changeScore(score + gameDifficultyVariables.getScoreValueIfShipKilledEnemy());
          // звук вырыва вражеского карабля
          if (isSounds) {
            props.playExplosion();
          }
        }
      }
    }

    // если ли сопрекосновение карабля с врагами
    const ship = document.getElementById('ship');

    if (currentEnemy && ship) {
      const isShipOnEnemy = doElsCollide(currentEnemy, ship);
      if (isShipOnEnemy) {
        // создаем взрыв(пришельца)
        props.didMountNewExplosion(props.x, props.y);
        // убиваем пришельца
        props.unmountChildEnemy(idComponent);
        // отничаем здовье у нашего карабля
        props.changeLifeValue(lifeValue - gameDifficultyVariables.getLifeValueMinusIfShipifHitTheShip());
      }
    }
  }, 10)


  // цикл анимации движения врага
  useInterval(() => {

    const outSideY = window.innerHeight + 10;
    const outSideXmax = window.innerWidth + 30;

    // если выстрел ушел за горизонт - удаляем его
    if (EnemyY > outSideY || EnemyX > outSideXmax || EnemyX < 0) {
      // console.log('unmound enemy')
      props.unmountChildEnemy(idComponent);
    }

    const needNewY = props.y + 20;

    // случайны "+" или "-", от случайного числа
    const getBooleanPlusOrMinus = getRandomArbitrary(0, 1);
    if (getBooleanPlusOrMinus) {
      // если true - то + 3px
      props.changeSpecialEnemy(idComponent, {
        x: (EnemyX + getRandomArbitrary(0, 60)),
        y: needNewY
      })

    } else {
      // если false - то - 3px
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
