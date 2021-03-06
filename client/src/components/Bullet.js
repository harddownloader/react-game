import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';

import useInterval from '../utils/useInterval';
import useStickyState from '../utils/useStickyState'


function Bullet(props) {

  const BulletY = props.y;
  const BulletX = props.x;
  const { idComponent, bulletType } = props;

  // координаты выстрела
  const [posBulletX, setPosBulletX] = useStickyState(BulletX, 'posBulletX');
  const [posBulletY, setPosBulletY] = useStickyState(BulletY, 'posBulletY');

  // при предоставлении y - сохраняем его в стейт
  useEffect(() => {
    setPosBulletY(BulletY);
  }, [BulletY]);

  // при предоставлении x - сохраняем его в стейт
  useEffect(() => {
    setPosBulletX(BulletX);
  }, [BulletX]);

  // цикл на анимирование полета выстрелла вверх
  useInterval(() => {

    // если выстрел ушел за горизонт - удаляем его
    if (posBulletY < 0) {
      props.unmountMe(idComponent);
    }

    // если выстрел еще на нашем экране - то двигаем его вверж на 5px
    setPosBulletY(posBulletY - 5);
  }, 10);

  return (
    <>
      <div
        className={`bullet bullet-type-${bulletType}`}
        id={`${idComponent}BulletNo`}
        style={{ top: `${posBulletY}px`, left: `${posBulletX}px` }}
      ></div>
    </>
  );
}

export default Bullet;
