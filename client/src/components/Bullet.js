import React, {
  // useRef,
  // useState,
  // useEffect,
  // useContext,
  // useMemo,
  // useCallback,
} from 'react';

import useInterval from '../utils/useInterval';

function Bullet(props) {

  const { idComponent, bulletType } = props;

  // цикл на анимирование полета выстрелла вверх
  useInterval(() => {
    // если выстрел еще на нашем экране - то двигаем его вверж на 5px
    props.changeSpecialBullet(idComponent, {
      x: props.x,
      y: (props.y - 10)
    })
  }, 10);

  return (
    <>
      <div
        className={`bullet bullet-type-${bulletType}`}
        id={`${idComponent}BulletNo`}
        style={{ top: `${props.y}px`, left: `${props.x}px` }}
      ></div>
    </>
  );
}

export default Bullet;
