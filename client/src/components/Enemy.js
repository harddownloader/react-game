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
          // alert('hit')
          // создаем взрыв
          // console.log('explosions x', enemyes[q].x);
          // console.log('explosions y', enemyes[q].y);
          // console.log('explosions x clientLeft', currentEnemy.offsetLeft);
          // console.log('explosions y clientTop', currentEnemy.offsetTop);
          // didMountNewExplosion(enemyes[q].x, enemyes[q].y);
          props.didMountNewExplosion(currentEnemy.offsetLeft, currentEnemy.offsetTop);
          // удаляем наш выстрел
          props.unmountChildBullet(bulletsTmp[i].id);
          // удаляем врага
          // console.log('after currentEnemy', idComponent)
          props.unmountChildEnemy(idComponent);
          // добавляем нам очков
          props.changeScore(score + gameDifficultyVariables.getScoreValueIfShipKilledEnemy());
          // звук вырыва вражеского карабля
          if (isSounds) playExplosion();
        }
      }
    }

    // если ли сопрекосновение карабля с врагами
    const ship = document.getElementById('ship');

    if (currentEnemy && ship) {
      const isShipOnEnemy = doElsCollide(currentEnemy, ship);
      if (isShipOnEnemy) {
        // создаем взрыв(пришельца)
        // console.log('enemyes[q].x', enemyes[q].x)
        // console.log('enemyes[q].y',  enemyes[q].y)
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
    // если выстрел ушел за горизонт - удаляем его
    if (EnemyY > outSideY) {
      props.unmountChildEnemy(idComponent);
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
