import React, { useRef, useState, useEffect, useContext, useMemo, useCallback } from 'react';

import useInterval from '../utils/useInterval';


function Bullet(props) {
  const BulletY = props.y;
  const BulletX = props.x;
  const idComponent = props.idComponent;

  // координаты выстрела
  const [posBulletX, setPosBulletX] = useState(BulletX);
  const [posBulletY, setPosBulletY] = useState(BulletY);
  // const [flag, setFlag] = useState(0);

  // const onBulletChangedX = useCallback((newValue) => setPosBulletX(newValue), []);
  // const onBulletChangedY = useCallback((newValue) => setPosBulletY(newValue), []);
  // const changeFlag = useCallback((newValue) => setFlag(newValue), []);

  // при предоставлении y - сохраняем его в стейт
  useEffect(() => {
    // console.log('new Y bullet');
    setPosBulletY(BulletY);
  },[BulletY]);

  // при предоставлении x - сохраняем его в стейт
  useEffect(() => {
    // console.log('new X bullet');
    setPosBulletX(BulletX)
  }, [BulletX])

  // цикл на анимирование полета выстрелла вверх
  useInterval(() => {
    // setFlag(flag + 1);
    // console.log('flag', flag);

    // если выстрел ушел за горизонт - удаляем его
    if(posBulletY < 0) {
      props.unmountMe(idComponent)
    }

    // если выстрел еще на нашем экране - то двигаем его вверж на 5px
    setPosBulletY(posBulletY - 5);
  }, 10);


  return (
    <>
      <div className="bullet" id={idComponent + 'BulletNo'} style={{top: posBulletY + 'px', left: posBulletX + 'px'}}></div>
    </>
  );
}

export default Bullet;
