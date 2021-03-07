import React, {
  // useRef,
  // useState,
  // useEffect,
  // useContext,
  // useMemo,
  // useCallback,
} from 'react';

import useInterval from '../utils/useInterval';
// import useTimout from '../utils/useTimout';
// import useStickyState from '../utils/useStickyState'


function Bullet(props) {

  // const BulletY = props.y;
  // const BulletX = props.x;
  const { idComponent, bulletType } = props;

  // координаты выстрела
  // const [posBulletX, setPosBulletX] = useStickyState(BulletX, 'posBulletX');
  // const [posBulletY, setPosBulletY] = useStickyState(BulletY, 'posBulletY');

  // // при предоставлении y - сохраняем его в стейт
  // useEffect(() => {
  //   setPosBulletY(BulletY);
  // }, [BulletY]);

  // // при предоставлении x - сохраняем его в стейт
  // useEffect(() => {
  //   setPosBulletX(BulletX);
  // }, [BulletX]);

  // цикл на анимирование полета выстрелла вверх
  useInterval(() => {

    // если выстрел ушел за горизонт - удаляем его
    // if (props.y < 0) {
    //   props.unmountMe(idComponent);
    // }

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
