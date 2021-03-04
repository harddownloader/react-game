import React, { useRef, useState, useEffect, useContext, useMemo, useCallback } from 'react';

// import {AppContext} from '../App';
import useInterval from '../utils/useInterval';


function Bullet(props) {
  // const {BulletY, BulletX} = useContext(AppContext);
  const BulletY = props.y;
  const BulletX = props.x;
  const idComponent = props.idComponent;

  // const timoutId = setTimeout(()=> {
  //   setPosBullet({
  //     x: event.clientX,
  //     y: (event.clientY + 1)
  //   })
  //   if(count < 100) {
  //     count++
  //     console.log('count < 100')
  //   } else {
  //     clearTimeout(timoutId)
  //   }

  // координаты выстрела
  const [posBulletX, setPosBulletX] = useState(BulletX);
  const [posBulletY, setPosBulletY] = useState(BulletY);
  // const [flag, setFlag] = useState(0);

  const onBulletChangedX = useCallback((newValue) => setPosBulletX(newValue), []);
  const onBulletChangedY = useCallback((newValue) => setPosBulletY(newValue), []);
  const changeFlag = useCallback((newValue) => setFlag(newValue), []);

  useEffect(() => {
    // console.log('new Y bullet');
    setPosBulletY(BulletY);
  //   // const timeout = setTimeout(() => {
  //   //   console.log('flag', flag)
  //   //   setFlag(flag + 1);
  //   // }, 1000);

  //   // return () => {
  //   //   clearTimeout(timeout);
  //   // };
  },[BulletY]);

  useEffect(() => {
    // console.log('new X bullet');
    setPosBulletX(BulletX)
  }, [BulletX])

  useInterval(() => {
    // setFlag(flag + 1);
    // console.log('flag', flag);

    // если выстрел ушел за горизонт - удаляем его
    if(posBulletY < 0) {
      props.unmountMe(idComponent)
    }

    setPosBulletY(posBulletY - 5);
    // console.log('posBulletY', posBulletY);
  }, 50);

  
  

  return (
    <>
      <div className="bullet" id={idComponent + 'BulletNo'} style={{top: posBulletY + 'px', left: posBulletX + 'px'}}></div>
    </>
  );
}

export default Bullet;
