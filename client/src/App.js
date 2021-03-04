import React, { useRef, useState, useEffect, useContext, useMemo, useReducer } from 'react';
// import jQuery from 'jquery';
import './App.scss';

// жизни
import Lifes from './components/Lifes';
// полоска жизни
import LifeBar from './components/LifeBar';
// очки игрока
import Score from './components/Score';
// карабль игрока
import Spaceship from './components/Spaceship';
// выстрелы карабля
import Bullet from './components/Bullet';
// враги
import Enemy from './components/Enemy'

// utils
import makeId from './utils/generateRandomString';
import getRandomInt from './utils/generateRandomNumber'
import useInterval from './utils/useInterval';
import getRandomArbitrary from './utils/generateRandomNumberArbitrary'


export const AppContext = React.createContext();

function App() {
  // кол-во жизней
  const [lifes, setLifes] = useState(3);
  // для изменения кол-ва жизней
  const changeLifes = (count) => setLifes(prev => count);

  // очки игрока
  const [score, setScore] = useState(0);
  // для изменения кол-ва жизней
  const changeScore = (newScore) => setScore(prev => newScore);

  // уровень жизни(полоска) - 200px
  const [lifeValue, setLifeValue] = useState(200);
  // для изменения уровеня жизни(полоска)
  const changeLifeValue = (count) => setScore(prev => count);

  /* ---- враги ----- */
  // враги
  const [enemyes, setEnemys] = useState([]);

  const didMountNewEnemy = (x, y) => {
    const randomId = makeId(10);
    const randomType = getRandomArbitrary(1, 4)
    // console.log('randomId', randomId)
    // console.log('posBulletX', x)

    // создаем нового врага
    setEnemys([
      ...enemyes,
      {
        id: randomId,
        type: randomType,
        x: x,
        y: y
      }
    ]);
  };

  // удалем выстрел если он скрылся за экран
  const unmountChildEnemy = (idComponent) => {
    const enemyesTmp = enemyes;
    // удаляем нужного врага
    enemyesTmp.splice(idComponent, 1);
    // console.log('bulletsTmp', bulletsTmp);

    // сохраняем новое состояние с врагами
    setEnemys(enemyesTmp);
  }

  // цикл на добавление врагов, если их недостаточно
  useInterval(() => {
    // setFlag(flag + 1);
    // console.log('flag', flag);

    // если выстрел ушел за горизонт - удаляем его
    if(enemyes.length < 5) {
      const y = 0;
      const maxWidth = window.innerWidth
      const x = getRandomInt(maxWidth)
      didMountNewEnemy(x, y)
    }

  }, 3000);

  /* ---- /враги ----- */


  /* ---- крабль ---- */
  // координаты карабля
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  /* --- выстрелы нашего карабля --- */
  // координаты выстрела
  const [posBulletX, setPosBulletX] = useState(0);
  const [posBulletY, setPosBulletY] = useState(0);
  const [bullets, setBullets] = useState([]);

  // добавляем новый выстрел в список выстрелов
  const didMountNewBullet = (x, y) => {
    const randomId = makeId(10);
    // console.log('randomId', randomId)
    // console.log('posBulletX', x)

    // создаем новый выстрел
    setBullets([
      ...bullets,
      {
        id: randomId,
        x: x,
        y: y
      }
    ]);
  };

  // удалем выстрел если он скрылся за экран
  const unmountChildBullet = (idComponent) => {
    const bulletsTmp = bullets;
    // удаляем нужный выстрел из копии стейта игры
    bulletsTmp.splice(idComponent, 1);
    // console.log('bulletsTmp', bulletsTmp);
    // сохраняем новый стейт без ненужного выстрела
    setBullets(bulletsTmp);
  }
  /* --- /выстрелы нашего карабля --- */

  /* --- ship control --- */
  useEffect(() => {
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mousedown', mouseDownHandler);

    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
    }
  });
  /* --- /ship control --- */

  /* --- ship --- */
  // когда произошло событие движения миши
  const mouseMoveHandler = (event) => {
    setPosX(event.clientX);
    setPosY(event.clientY);
  };

  // когда произошел клик
  const mouseDownHandler = (event) => {
    console.log('mouseDownHandler');
    // создаем выстрел
    didMountNewBullet(event.clientX, event.clientY);
  };
  /* --- /ship--- */

  return (
    <AppContext.Provider value={{
      lifesCount: lifes,
      scoreCount: score,
      lifeValue: lifeValue,
      shipX: posX,
      shipY: posY,
      BulletY: posBulletY,
      BulletX: posBulletX
    }}>
      <div className="sky"></div>
      <pre>x - {posX}</pre>
      <pre>y - {posY}</pre>
      <Lifes />
      <Score />
      <Spaceship/>

      {/* выстрелы нашего карабля */}
      {bullets.map(item => (
        <Bullet key={item.id} idComponent={item.id} x={item.x} y={item.y} unmountMe={unmountChildBullet} />
      ))}
      <LifeBar />
      
      {/* враги */}
      {enemyes.map(item => (
        <Enemy key={item.id} idComponent={item.id} x={item.x} y={item.y} type={item.type} unmountMe={unmountChildEnemy} />
      ))}
    </AppContext.Provider>
  );
}


export default App;
