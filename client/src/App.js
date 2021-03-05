import React, { useRef, useState, useEffect, useContext, useMemo, useReducer } from 'react';
// для музыки
import useSound from 'use-sound';
// import jQuery from 'jquery';
import './App.scss';

// фон
import Space from './components/Space';
// fullscreen блок
import Fullscreen from './components/Fullscreen';
// sounds блок
import Sounds from './components/Sounds'
// сцена конца игры
import Menu from './screens/Menu';
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
import Enemy from './components/Enemy';
// врыв
import Explosion from './components/Explosion'
// footer
import Footer from './components/Footer'

// utils
import makeId from './utils/generateRandomString';
import getRandomInt from './utils/generateRandomNumber'
import useInterval from './utils/useInterval';
import getRandomArbitrary from './utils/generateRandomNumberArbitrary'
import doElsCollide from './utils/isElementOnAnoterElement'

// sounds
import soundBgSound from './assets/audio/bg.mp3';
import laserSound from './assets/audio/laser.mp3'; // shot
import gameOverSound from './assets/audio/warp.mp3'; // game over
import explosionSound from './assets/audio/explosion.mp3'; // взрыв вражеского карабля


export const AppContext = React.createContext();



function App() {
  // статус игры
  const [isGameOver, setIsGameOver] = useState(null);
  // для изменения статуса игры
  const changeIsGameOver = (status) => setIsGameOver(prev => status);
  // кол-во жизней
  const [lifes, setLifes] = useState(0);
  // для изменения кол-ва жизней
  const changeLifes = (count) => setLifes(prev => count);

  // очки игрока
  const [score, setScore] = useState(0);
  // для изменения кол-ва жизней
  const changeScore = (newScore) => setScore(prev => newScore);

  // уровень жизни(полоска) - 200px
  const [lifeValue, setLifeValue] = useState(0);
  // для изменения уровеня жизни(полоска)
  const changeLifeValue = (count) => setLifeValue(prev => count);

  // координаты выстрела нашего ship
  const [posBulletX, setPosBulletX] = useState(0);
  const [posBulletY, setPosBulletY] = useState(0);
  const [bullets, setBullets] = useState([]);

  // музыка
  const [isSounds, setIsSounds] = useState(false);
  const toggleIsSounds = (status) => setIsSounds(prev => status);


  /* --- sounds --- */
  // bg
  const [playBg, { stop }] = useSound(
    soundBgSound,
    { volume: 1 }
  );
  // laser
  const [playLaser, { stopLaser }] = useSound(
    laserSound,
    { volume: 1 }
  );
  // game over
  const [playGameOver, { stopGameOver }] = useSound(
    gameOverSound,
    { volume: 1 }
  );
  // взрыв вражеского карабля
  const [playExplosion, { stopExplosion }] = useSound(
    explosionSound,
    { volume: 1 }
  );

  useEffect(() => {
    console.log('isSounds', isSounds)
    if (isSounds) {
      playBg();
    } else {
      stop();
    }
  }, [isSounds]);
  /* --- /sounds --- */

  /* --- взрывы --- */

  const [explosions, setExplosions] = useState([]);
  const changeExplosions = (newState) => setExplosions(prev => newState);

  const didMountNewExplosion = (x, y) => {
    const randomId = makeId(10);

    // создаем новый взрыв
    changeExplosions([
      ...explosions,
      {
        id: randomId,
        x: x,
        y: y
      }
    ]);
  };

  const unmountChildExplosion = (idComponent) => {
    const explosionsTmp = explosions;
    // удаляем нужный вырыв из копии стейта игры
    explosionsTmp.splice(idComponent, 1);
    // сохраняем новый стейт без ненужного взрыва
    changeExplosions(explosionsTmp);
  }

  /* --- /взрывы --- */


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

  // цикл проверок на сопрекосновение игровых субъектов
  useEffect(() => {
    
    // есть ли соприкосновение врагов и выстрелов карабля
    for(let q=0; q<enemyes.length; q++) {
      const currentEnemy= document.getElementById(enemyes[q].id + 'EnemyNo');
      const bulletsTmp = bullets;

      // проверяем находятся ли выстрелы на месте врагов - если да, то убираем 2х и влюсуем очки
      for (let i=0; i< bulletsTmp.length ; i++) {
        let bulletEl = document.getElementById(bulletsTmp[i].id + 'BulletNo')
        // console.log(bulletEl)
        if(currentEnemy && bulletEl) {
          let isHit = doElsCollide(currentEnemy, bulletEl)
          if (isHit) {
            // alert('hit')
            // создаем взрыв
            didMountNewExplosion(enemyes[q].x, enemyes[q].y)
            // удаляем наш выстрел
            unmountChildBullet(bulletsTmp[i].id)
            // удаляем врага
            unmountChildEnemy(enemyes[q].id)
            // добавляем нам очков
            changeScore(score + 100)
            // звук вырыва вражеского карабля
            if(isSounds) playExplosion();
          }
        }
      }

      // если ли сопрекосновение карабля с врагами
      const ship = document.getElementById('ship')
      
      if(currentEnemy && ship) {
        let isShipOnEnemy = doElsCollide(currentEnemy, ship)
        if (isShipOnEnemy) {
          // создаем взрыв(пришельца)
          didMountNewExplosion(enemyes[q].x, enemyes[q].y)
          // убиваем пришельца 
          unmountChildEnemy(enemyes[q].id)
          // отничаем здовье у нашего карабля
          changeLifeValue(lifeValue - 10)
        }
      }
    }
    
    // console.log('thisElement', thisElement.offsetTop)
    return () => {
      
    };
  });

  // когда меняется уровень здоровья
  useEffect(() => {
    // когда уровень здоровья равен 0 - то расходуем жизнь
    if (lifeValue === 0 && lifes > 0) {
      changeLifes(lifes-1)
      changeLifeValue(200)
    }

  }, [lifeValue]);

  // когда меняется кол-во жизней
  useEffect(() => {
    // когда нет жизней - то ставим GameOver
    if (lifes === 0 && isGameOver !== null) {
      changeIsGameOver(true)
      // ставим звук завершения игры
      if(isSounds) playGameOver();
    }
  }, [lifes]);

  /* ---- /враги ----- */

  /* ---- крабль ---- */
  // координаты карабля
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  /* --- выстрелы нашего карабля --- */
  

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
    // создаем звук выстрела
    if(isSounds) playLaser();
    
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
    // window.addEventListener('keypress', fullScreenHandler);

    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      // window.addEventListener('keypress', fullScreenHandler)
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

  /* --- game --- */
  const startNewGame = () => {
    console.log('isGameOver in startNewGame', isGameOver)
    changeLifes(3)
    changeScore(0)
    changeLifeValue(200)
    setEnemys([])
    setBullets([])
    setPosX(0)
    setPosY(0)
    changeIsGameOver(false)
  }
  /* --- /game --- */

  // console.log('lifes', lifes)
  // console.log('isGameOver', isGameOver)
  if(lifes === 0 && isGameOver) {
    return (
      <>
        <Space />
        <Menu title="GAME OVER" startNewGame={startNewGame} />
        <Fullscreen />
        <Sounds toggleIsSounds={toggleIsSounds} isSounds={isSounds}/>
        <Footer />
      </>
    )
  } else if(lifes === 0 && !isGameOver) {
    return (
      <>
        <Space />
        <Menu title="SPACE BATTLE" startNewGame={startNewGame} />
        <Fullscreen />
        <Sounds toggleIsSounds={toggleIsSounds} isSounds={isSounds}/>
        <Footer />
      </>
    )
  } else {
    return (
      <AppContext.Provider value={{
        lifesCount: lifes,
        scoreCount: score,
        lifeValue: lifeValue,
        shipX: posX,
        shipY: posY,
        BulletY: posBulletY,
        BulletX: posBulletX,
        enemyes: enemyes,
        bullets: bullets
      }}>
        <Space />
        <pre>x - {posX}</pre>
        <pre>y - {posY}</pre>
        <Lifes />
        <Score />
        <Spaceship />
  
        {/* выстрелы нашего карабля */}
        {bullets.map(item => (
          <Bullet
            key={item.id}
            idComponent={item.id}
            x={item.x}
            y={item.y}
            unmountMe={unmountChildBullet}
          />
        ))}
        <LifeBar />

        {/* взрывы */}
        {explosions.map((item, index) => (
          <Explosion
            key={item.id}
            idComponent={item.id}
            x={item.x}
            y={item.y}
            unmountMe={unmountChildExplosion}
          />
        ))}

        {/* враги */}
        {enemyes.map((item, index) => (
          <Enemy
            key={item.id}
            idComponent={item.id}
            x={item.x}
            y={item.y}
            type={item.type}
            unmountMe={unmountChildEnemy}
          />
        ))}
      </AppContext.Provider>
    );
  }

  
}


export default App;
