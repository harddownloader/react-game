import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useMemo,
  useReducer,
} from 'react';
// для музыки
import useSound from 'use-sound';
// import jQuery from 'jquery';
import './App.scss';

// фон
import Space from './components/Space';
// fullscreen блок
import Fullscreen from './components/Fullscreen';
// sounds блок
import Sounds from './components/Sounds';
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
import Explosion from './components/Explosion';
// footer
import Footer from './components/Footer';
// level
import Level from './components/Level'

// utils
import makeId from './utils/generateRandomString';
import getRandomInt from './utils/generateRandomNumber';
import useInterval from './utils/useInterval';
import useStickyState from './utils/useStickyState'
import getRandomArbitrary from './utils/generateRandomNumberArbitrary';
import doElsCollide from './utils/isElementOnAnoterElement';

// sounds
import soundBgSound from './assets/audio/bg.mp3';
import laserSound from './assets/audio/laser.mp3'; // shot
import gameOverSound from './assets/audio/warp.mp3'; // game over
import explosionSound from './assets/audio/explosion.mp3'; // взрыв вражеского карабля
import clickSound from './assets/audio/click.mp3'

export const AppContext = React.createContext();

function App() {
  // статус игры
  const [isGameOver, setIsGameOver] = useStickyState(null, 'isGameOver');
  // для изменения статуса игры
  const changeIsGameOver = status => setIsGameOver(prev => status);
  // сложность игры
  const [gameDifficulty, setGameDifficulty] = useStickyState(null, 'gameDifficulty');
  const changeGameDifficulty = status => setGameDifficulty(prev => status);
  // статус паузы
  const [isPauseGame, setIsPauseGame] = useStickyState(false, 'isPauseGame');
  const toggleIsPauseGame = status => setIsPauseGame(prev => status);
  // сипсок рекордов
  const [records, setRecords] = useStickyState([], 'records');
  const changeRecords = newState => setRecords(prev => newState);
  // кол-во жизней
  const [lifes, setLifes] = useStickyState(0, 'lifes');
  // для изменения кол-ва жизней
  const changeLifes = count => setLifes(prev => count);

  // очки игрока
  const [score, setScore] = useStickyState(0, 'score');
  // для изменения кол-ва жизней
  const changeScore = newScore => setScore(prev => newScore);

  // уровень жизни(полоска) - 200px
  const [lifeValue, setLifeValue] = useStickyState(0, 'lifeValue');
  // для изменения уровеня жизни(полоска)
  const changeLifeValue = count => setLifeValue(prev => count);

  // координаты выстрела нашего ship
  const [posBulletX, setPosBulletX] = useStickyState(0, 'posBulletX');
  const [posBulletY, setPosBulletY] = useStickyState(0, 'posBulletY');
  const [bullets, setBullets] = useStickyState([], 'bullets');

  // музыка
  const [isSounds, setIsSounds] = useStickyState(false, 'isSounds');
  const toggleIsSounds = status => setIsSounds(prev => status);

  /* --- sounds --- */
  // bg
  const [playBg, { stop }] = useSound(soundBgSound, { volume: 1 });
  // laser
  const [playLaser, { stopLaser }] = useSound(laserSound, { volume: 1 });
  // game over
  const [playGameOver, { stopGameOver }] = useSound(gameOverSound, {
    volume: 1,
  });
  const [playClickSound, { stopPlayClick }] = useSound(clickSound, {
    volume: 1,
  });
  // взрыв вражеского карабля
  const [playExplosion, { stopExplosion }] = useSound(explosionSound, {
    volume: 1,
  });

  // переключаемся между режимом вкл/выкл музыки
  useEffect(() => {
    // console.log('isSounds', isSounds);
    if (isSounds) {
      playBg();
    } else {
      stop();
    }
  }, [isSounds]);
  /* --- /sounds --- */


  /* --- lvl --- */
  const [level, setLevel] = useStickyState(1, "level");
  const changeLevel = newState => setLevel(prev => newState);
  /* --- /lvl --- */


  /* --- взрывы --- */
  const [explosions, setExplosions] = useStickyState([], 'explosions');
  const changeExplosions = newState => setExplosions(prev => newState);

  // создаем взрыв
  const didMountNewExplosion = (x, y) => {
    const randomId = makeId(10);
    // console.log('didMountNewExplosion x', x)
    // console.log('didMountNewExplosion y', y)
    // создаем новый взрыв
    changeExplosions([
      ...explosions,
      {
        id: randomId,
        x,
        y,
      },
    ]);
  };

  // удаляем взрыв
  const unmountChildExplosion = idComponent => {
    const explosionsTmp = explosions;
    // удаляем нужный вырыв из копии стейта игры
    explosionsTmp.splice(idComponent, 1);
    // сохраняем новый стейт без ненужного взрыва
    changeExplosions(explosionsTmp);
  };

  /* --- /взрывы --- */

  /* ---- враги ----- */
  // враги

  const [enemyes, setEnemys] = useStickyState([], 'enemyes');
  // const changeEmenyes = (newState) => {prev => newState}

  // обновляем координаты врага (вызывается из дочернего компонента - т.е. компонента врага)
  const changeSpecialEnemy = (enemyId, newEnemyData) => {
    const enemyesTmp = enemyes;
    // console.log(enemyes)
    for(let i=0; i<enemyesTmp.length; i++) {
      // console.log('enemyesTmp[i].id', enemyesTmp[i].id)
      // console.log('enemyId', enemyId)
      // console.log(enemyesTmp[i].id == enemyId)
      if(enemyesTmp[i].id == enemyId) {
        // console.log('i find enemy')
        enemyesTmp[i].x = newEnemyData.x;
        enemyesTmp[i].y = newEnemyData.y;
      }
    }
    // console.log('newEnemyData', enemyId)
    // console.log('enemyes', enemyes)
    // сохраняем обновленный массив врагов
    setEnemys([
      ...enemyesTmp
    ]);
  }

  // создаем врага
  const didMountNewEnemy = (x, y) => {
    const randomId = makeId(10);
    const randomType = getRandomArbitrary(1, 4);
    // console.log('randomId', randomId)
    // console.log('posBulletX', x)

    // создаем нового врага
    setEnemys([
      ...enemyes,
      {
        id: randomId,
        type: randomType,
        x: x,
        y: y,
      },
    ]);
  };

  // удаляем врага
  const unmountChildEnemy = idComponent => {
    // console.log('unmountChildEnemy after', idComponent)
    let enemyesTmp = enemyes;
    // удаляем нужного врага
    // enemyesTmp.splice(idComponent, 1);
    enemyesTmp = enemyesTmp.filter(function( obj ) {
      return obj.id !== idComponent;
  });

    // сохраняем новое состояние с врагами
    setEnemys(enemyesTmp);
  };

  // что меняется при изменении уровня сложности
  const gameDifficultyVariables = {
    // как часто респамнятся враги
    getTimerRespawn:function() {
      if (gameDifficulty === 'easy') {
        return 3000;
      } else if (gameDifficulty === 'medium') {
        return 1000;
      } else if (gameDifficulty === 'hard') {
        return 500;
      }
    },

    // какое максимальное кол-во врагов может быть на экране в момент
    getMaxEnemyCount:function() {
    
      if (gameDifficulty === 'easy') {
        return 5;
      } else if (gameDifficulty === 'medium') {
        return 6;
      } else if (gameDifficulty === 'hard') {
        return 7;
      }
      
    },

    // сколько очков получаем за убитого врага
    getScoreValueIfShipKilledEnemy: function() {
      if (gameDifficulty === 'easy') {
        return 100;
      } else if (gameDifficulty === 'medium') {
        return 75;
      } else if (gameDifficulty === 'hard') {
        return 50;
      }
    },

    // сколько жизней отнимается при ударе нашего карабля
    getLifeValueMinusIfShipifHitTheShip: function() {
      if (gameDifficulty === 'easy') {
        return 50;
      } else if (gameDifficulty === 'medium') {
        return 100;
      } else if (gameDifficulty === 'hard') {
        return 200;
      }
    }
  }

  // цикл на добавление врагов, если их недостаточно
  useInterval(() => {
    // если выстрел ушел за горизонт - удаляем его
    if (enemyes.length < gameDifficultyVariables.getMaxEnemyCount()) {
      const y = -50;
      const maxWidth = window.innerWidth;
      const x = getRandomInt(maxWidth);
      didMountNewEnemy(x, y);
    }
  }, gameDifficultyVariables.getTimerRespawn());




  // цикл проверок на сопрекосновение игровых субъектов
  // useInterval(() => {
  //   // есть ли соприкосновение врагов и выстрелов карабля
  //   for (let q = 0; q < enemyes.length; q++) {
  //     const currentEnemy = document.getElementById(`${enemyes[q].id}EnemyNo`);
  //     // console.log('before currentEnemy', enemyes[q].id)
  //     const bulletsTmp = bullets;

  //     // проверяем находятся ли выстрелы на месте врагов - если да, то убираем 2х и влюсуем очки
  //     for (let i = 0; i < bulletsTmp.length; i++) {
  //       const bulletEl = document.getElementById(`${bulletsTmp[i].id}BulletNo`);
  //       // console.log(bulletEl)
  //       if (currentEnemy && bulletEl) {
  //         const isHit = doElsCollide(currentEnemy, bulletEl);
  //         if (isHit) {
  //           // alert('hit')
  //           // создаем взрыв
  //           // console.log('explosions x', enemyes[q].x);
  //           // console.log('explosions y', enemyes[q].y);
  //           // console.log('explosions x clientLeft', currentEnemy.offsetLeft);
  //           // console.log('explosions y clientTop', currentEnemy.offsetTop);
  //           // didMountNewExplosion(enemyes[q].x, enemyes[q].y);
  //           didMountNewExplosion(currentEnemy.offsetLeft, currentEnemy.offsetTop);
  //           // удаляем наш выстрел
  //           unmountChildBullet(bulletsTmp[i].id);
  //           // удаляем врага
  //           // console.log('after currentEnemy', enemyes[q].id)
  //           unmountChildEnemy(enemyes[q].id);
  //           // добавляем нам очков
  //           changeScore(score + gameDifficultyVariables.getScoreValueIfShipKilledEnemy());
  //           // звук вырыва вражеского карабля
  //           if (isSounds) playExplosion();
  //         }
  //       }
  //     }

  //     // если ли сопрекосновение карабля с врагами
  //     const ship = document.getElementById('ship');

  //     if (currentEnemy && ship) {
  //       const isShipOnEnemy = doElsCollide(currentEnemy, ship);
  //       if (isShipOnEnemy) {
  //         // создаем взрыв(пришельца)
  //         // console.log('enemyes[q].x', enemyes[q].x)
  //         // console.log('enemyes[q].y',  enemyes[q].y)
  //         didMountNewExplosion(enemyes[q].x, enemyes[q].y);
  //         // убиваем пришельца
  //         unmountChildEnemy(enemyes[q].id);
  //         // отничаем здовье у нашего карабля
  //         changeLifeValue(lifeValue - gameDifficultyVariables.getLifeValueMinusIfShipifHitTheShip());
  //       }
  //     }
  //   }

    
  // }, 100);

  // когда меняется уровень здоровья
  useEffect(() => {
    // когда уровень здоровья равен 0 - то расходуем жизнь
    if (lifeValue === 0 && lifes > 0) {
      changeLifes(lifes - 1);
      changeLifeValue(200);
    }
  }, [lifeValue]);

  // когда меняется кол-во жизней
  useEffect(() => {
    // когда нет жизней - то ставим GameOver
    if (lifes === 0 && isGameOver !== null) {
      changeIsGameOver(true);
      // ставим звук завершения игры
      if (isSounds) playGameOver();



      // записываем результат в таблицу рекордов

      // get date for new record
      const currentDate = new Date();
      const currentDayOfMonth = currentDate.getDate();
      const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
      const currentYear = currentDate.getFullYear();
      const currentHours = currentDate.getHours();
      const currentMinutes = currentDate.getMinutes();

      if (records.length === 5) {
        const recordsValues = [];
        const recordsTmp = records;
        for (let record of recordsTmp) {
          recordsValues.push(record.recordValue);
        }
        const findedMinValueReacord = Math.min.apply(Math, recordsValues);

        // recordsTmp.map((record) => {
        //   if(record.recordValue === findedMinValueReacord) {
        //     return {
        //       recordValue: score,
        //       recordDate: currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear + " " + currentHours + ":" + currentMinutes
        //     }
        //   }
        // })
        for(let i=0; i<recordsTmp.length;i++) {
          if(recordsTmp[i].recordValue === findedMinValueReacord) {
            recordsTmp[i] = {
              recordValue: score,
              recordDate: currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear + " " + currentHours + ":" + currentMinutes
            }
          }
        }
        // console.log('new record', {
        //   recordValue: score,
        //   recordDate: currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear + " " + currentHours + ":" + currentMinutes
        // })
        // console.log('records', records)
        // console.log('recordsTmp', recordsTmp)
        // сохраняем новый рекорд
        changeRecords(
          [
            ...recordsTmp
          ]
        );
      } else if (records.length < 5) {
        // сохраняем новый рекорд
        changeRecords(
          [
            ...records,
            {
              recordValue: score,
              recordDate: currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear
            }
          ]
        );
      }
      
    }
  }, [lifes]);

  /* ---- /враги ----- */

  /* ---- крабль ---- */
  // координаты карабля
  const [posX, setPosX] = useStickyState(0, 'posX');
  const [posY, setPosY] = useStickyState(0, 'posY');

  /* --- выстрелы нашего карабля --- */

  const changeSpecialBullet = (bulletId, newBulletData) => {
    const bulletsTmp = bullets;
    for(let i=0; i<bulletsTmp.length; i++) {
      
      if(bulletsTmp[i].id == bulletId) {
        bulletsTmp[i].x = newBulletData.x;
        bulletsTmp[i].y = newBulletData.y;
      }
      if (bulletsTmp[i].y < 0) {
        // console.log('bulletsTmp[i].y', bulletsTmp[i].y)
        unmountChildBullet(bulletId);
      }
    }
    
    // сохраняем обновленный массив выстрелов
    setBullets([
      ...bulletsTmp
    ]);
  }

  // добавляем новый выстрел в список выстрелов
  const didMountNewBullet = (x, y) => {
    
    // console.log('randomId', randomId)
    // console.log('posBulletX', x)
    if(level > 6) {
      const randomId = makeId(10);
      // создаем новый выстрел
      setBullets([
        ...bullets,
        {
          id: randomId,
          x: x,
          y: y,
          bulletType: 4
        }
      ]);
    } else if(level === 6) {
      // для 3го уровня
      const randomId1 = makeId(10);
      const randomId2 = makeId(10);
      const randomId3 = makeId(10);
      // создаем новый выстрел
      setBullets([
        ...bullets,
        {
          id: randomId1,
          x: x + 20,
          y: y,
          bulletType: 3,
        },
        {
          id: randomId2,
          x: x,
          y: y,
          bulletType: 3
        },
        {
          id: randomId3,
          x: x - 20,
          y: y,
          bulletType: 3
        }
      ]);
    } else if(level >= 3 && level < 6) {
      const randomId1 = makeId(10);
      const randomId2 = makeId(10);
      setBullets([
        ...bullets,
        {
          id: randomId1,
          x: x + 20,
          y: y,
          bulletType: 2,
        },
        {
          id: randomId2,
          x: x - 20,
          y: y,
          bulletType: 2,
        }
      ]);
    } else {
      const randomId = makeId(10);
      // создаем новый выстрел
      setBullets([
        ...bullets,
        {
          id: randomId,
          x: x,
          y: y,
          bulletType: 1
        }
      ]);
    }
    
    // создаем звук выстрела
    if (isSounds) playLaser();
  };

  // удалем выстрел
  const unmountChildBullet = idComponent => {
    const bulletsTmp = bullets;
    // удаляем нужный выстрел из копии стейта игры
    bulletsTmp.splice(idComponent, 1);
    // console.log('bulletsTmp', bulletsTmp);
    // сохраняем новый стейт без ненужного выстрела
    setBullets(bulletsTmp);
  };
  /* --- /выстрелы нашего карабля --- */

  /* --- ship control --- */
  useEffect(() => {
    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('keydown', keypressHandler);

    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('keydown', keypressHandler)
    };
  });
  /* --- /ship control --- */


  /* --- keyboard --- */
  const keypressHandler = event => {
    console.log(event.code)
    if(event.code === 'Escape') {
      if (isPauseGame) {
        toggleIsPauseGame(false)
      } else {
        toggleIsPauseGame(true)
      }
    }

    if(event.code === 'KeyW' || event.code === 'ArrowUp') {
        console.log('up');
        setPosX(posX);
        setPosY(posY - 20);
    }
    if(event.code === 'KeyS' || event.code === 'ArrowDown') {
        console.log('down');
        setPosX(posX);
        setPosY(posY + 20);
    }
    if(event.code === 'KeyA' || event.code === 'ArrowLeft') {
        console.log('left');
        setPosX(posX - 20);
        setPosY(posY);
    }
    if(event.code === 'KeyD' || event.code === 'ArrowRight') {
        console.log('rigth');
        setPosX(posX + 20);
        setPosY(posY);
    }
    if(event.code === 'Space') {
        console.log('space - fire');
        didMountNewBullet(posX, posY);
    }
      
  }
  /* --- /keyboard --- */


  /* --- ship --- */
  // когда произошло событие движения миши
  const mouseMoveHandler = event => {
    let colisiaMishu = 15 // 0px сдвига - так как для малентких караблей не нужен сдвиг
    if(level === 1) {
      setPosX(event.clientX + colisiaMishu);
    } else if(level >= 2 && level < 4) {
      colisiaMishu = 25
      setPosX(event.clientX + colisiaMishu);
    } else if(level === 4) {
      colisiaMishu = 15
      setPosX(event.clientX + colisiaMishu);
    } else if(level >= 5) {
      colisiaMishu = 10 // 10px сдвига - чтобы нос карабля был на одном уровне с мышкой
      setPosX(event.clientX - colisiaMishu);
    }

    setPosY(event.clientY);
  };

  // когда произошел клик
  const mouseDownHandler = event => {
    console.log('mouseDownHandler');
    // создаем выстрел
    if(isGameOver || isPauseGame) {
      // если мы в меню
      // создаем звук клика
    if (isSounds) playClickSound();
    } else {
      // если мы в игре
      didMountNewBullet(event.clientX, event.clientY);
    }
    
  };
  /* --- /ship--- */

  /* --- game --- */
  const startNewGame = (difficulty) => {
    console.log('isGameOver in startNewGame', isGameOver);
    changeGameDifficulty(difficulty)
    changeLifes(3);
    changeScore(0);
    changeLifeValue(200);
    setEnemys([]);
    setBullets([]);
    setPosX(null);
    setPosY(null);
    changeLevel(1);
    changeIsGameOver(false);
    toggleIsPauseGame(false)
  };
  /* --- /game --- */

  // console.log('lifes', lifes)
  // console.log('isGameOver', isGameOver)
  if (lifes === 0 && isGameOver) {
    return (
      <AppContext.Provider
        value={{
          lifesCount: lifes,
          score: score,
          lifeValue,
          shipX: posX,
          shipY: posY,
          BulletY: posBulletY,
          BulletX: posBulletX,
          enemyes,
          bullets,
          level,
          records: records
        }}
      >
        <Space />
        <Menu title="GAME OVER" startNewGame={startNewGame} />
        <Fullscreen />
        <Sounds toggleIsSounds={toggleIsSounds} isSounds={isSounds} />
        <Footer />
      </AppContext.Provider>
    );
  } else if (lifes === 0 && !isGameOver) {
    return (
      <AppContext.Provider
        value={{
          lifesCount: lifes,
          score: score,
          lifeValue,
          shipX: posX,
          shipY: posY,
          BulletY: posBulletY,
          BulletX: posBulletX,
          enemyes,
          bullets,
          level,
          records: records
        }}
      >
        <Space />
        <Menu title="SPACE BATTLE" startNewGame={startNewGame} />
        <Fullscreen />
        <Sounds toggleIsSounds={toggleIsSounds} isSounds={isSounds} />
        <Footer />
      </AppContext.Provider>
    );
  } else if (lifes !== 0 && isPauseGame) {
    return (
      <AppContext.Provider
        value={{
          lifesCount: lifes,
          score: score,
          lifeValue,
          shipX: posX,
          shipY: posY,
          BulletY: posBulletY,
          BulletX: posBulletX,
          enemyes,
          bullets,
          level,
          records: records
        }}
      >
        <Space />
        <Menu title="PAUSE" startNewGame={startNewGame} />
        <Fullscreen />
        <Sounds toggleIsSounds={toggleIsSounds} isSounds={isSounds} />
        <Footer />
      </AppContext.Provider>
    )
  }
  return (
    <AppContext.Provider
      value={{
        lifesCount: lifes,
        score: score,
        lifeValue,
        shipX: posX,
        shipY: posY,
        BulletY: posBulletY,
        BulletX: posBulletX,
        enemyes,
        bullets,
        level,
        records: records,
        gameDifficultyVariables: gameDifficultyVariables,
        isSounds
      }}
    >
      <Space />
      {/* <pre>x - {posX}</pre>
      <pre>y - {posY}</pre> */}
      <Lifes />
      <Score />
      <Spaceship />

      {/* выстрелы нашего карабля */}
      {bullets.map(item => (
        <Bullet
          key={item.id}
          idComponent={item.id}
          bulletType={item.bulletType}
          x={item.x}
          y={item.y}
          // unmountMe={unmountChildBullet}
          changeSpecialBullet={changeSpecialBullet}
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
          unmountChildEnemy={unmountChildEnemy}
          changeSpecialEnemy={changeSpecialEnemy}
          unmountChildBullet={unmountChildBullet}
          didMountNewExplosion={didMountNewExplosion}
          playExplosion={playExplosion}
          changeLifeValue={changeLifeValue}
          changeScore={changeScore}
        />
      ))}
      {/* уровень */}
      <Level changeLevel={changeLevel} />
    </AppContext.Provider>
  );
}

export default App;
