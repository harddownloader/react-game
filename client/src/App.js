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
// таймер игры
import Timer from './components/Timer'
// панель пушек
import GunsPanel from './components/GunsPanel'
// boss
import Boss from './components/Boss'

// utils
import makeId from './utils/generateRandomString';
import getRandomInt from './utils/generateRandomNumber';
import useInterval from './utils/useInterval';
// import useStickyState from './utils/useStickyState'
import getRandomArbitrary from './utils/generateRandomNumberArbitrary';
import doElsCollide from './utils/isElementOnAnoterElement';

// sounds
import soundBgSound from '../public/assets/audio/bg.mp3';
import laserSound from '../public/assets/audio/laser.mp3'; // shot
import gameOverSound from '../public/assets/audio/warp.mp3'; // game over
import explosionSound from '../public/assets/audio/explosion.mp3'; // взрыв вражеского карабля
import clickSound from '../public/assets/audio/click.mp3'

export const AppContext = React.createContext();

function App() {
  // статус игры
  const [isGameOver, setIsGameOver] = useState(null)
  // для изменения статуса игры
  const changeIsGameOver = status => setIsGameOver(prev => status);
  // переменная для обозначния что игру только что запустили и еще не играми
  const [isStarting, setIsStarting] = useState(true)
  // сложность игры
  const [gameDifficulty, setGameDifficulty] = useState(null)
  const changeGameDifficulty = status => setGameDifficulty(prev => status);
  // статус паузы
  const [isPauseGame, setIsPauseGame] = useState(false)
  const toggleIsPauseGame = status => setIsPauseGame(prev => status);
  // сипсок рекордов
  const [records, setRecords] = useState([])
  const changeRecords = newState => setRecords(prev => newState);
  // кол-во жизней
  const [lifes, setLifes] = useState(0)
  // для изменения кол-ва жизней
  const changeLifes = count => setLifes(prev => count);
  // таймер игры
  const [timerSec, setTimerSec] = useState(0)
  const [timerMin, setTimerMin] = useState(0)
  // отображение фона
  const [spaceType, setSpaceType] = useState("1")
  // панель оружия
  const [gunsList, setGunsList] = useState([
    {
      id: 1,
      shots: 100,
      active: true
    },
    {
      id: 2,
      shots: 200,
      active: false
    },
    {
      id: 3,
      shots: 300,
      active: false
    },
    {
      id: 4,
      shots: 400,
      active: false
    }
  ])


  // очки игрока
  const [score, setScore] = useState(0)
  // для изменения кол-ва жизней
  const changeScore = newScore => setScore(prev => newScore);

  // уровень жизни(полоска) - 200px
  const [lifeValue, setLifeValue] = useState(0)
  // для изменения уровеня жизни(полоска)
  const changeLifeValue = count => setLifeValue(prev => count);

  // координаты выстрела нашего ship
  const [posBulletX, setPosBulletX] = useState(0)
  const [posBulletY, setPosBulletY] = useState(0)
  const [bullets, setBullets] = useState([], 'bullets');

  // музыка
  const [isSounds, setIsSounds] = useState(false)
  const toggleIsSounds = status => setIsSounds(prev => status);
  // уровень громкости
  const [soundValue, setSoundValue] = useState(0)
  const changeSoundValue = newVal => setSoundValue(prev => newVal);

  /* --- sounds --- */
  // bg
  const [playBg, { stop }] = useSound(soundBgSound, { volume: Number(soundValue) });
  // laser
  const [playLaser, { stopLaser }] = useSound(laserSound, { volume: Number(soundValue) });
  // game over
  const [playGameOver, { stopGameOver }] = useSound(gameOverSound, {
    volume: Number(soundValue),
  });
  const [playClickSound, { stopPlayClick }] = useSound(clickSound, {
    volume: Number(soundValue),
  });
  // взрыв вражеского карабля
  const [playExplosion, { stopExplosion }] = useSound(explosionSound, {
    volume: Number(soundValue),
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
  const [level, setLevel] = useState(1)
  const changeLevel = newState => setLevel(prev => newState);
  /* --- /lvl --- */


  /* --- взрывы --- */
  const [explosions, setExplosions] = useState([])
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

  const [enemyes, setEnemys] = useState([])
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
    const randomType = getRandomArbitrary(1, 8);
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

        for(let i=0; i<recordsTmp.length;i++) {
          if(recordsTmp[i].recordValue === findedMinValueReacord) {
            recordsTmp[i] = {
              recordValue: score,
              recordDate: currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear + " " + currentHours + ":" + currentMinutes
            }
          }
        }

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
  const [posX, setPosX] = useState(0)
  const [posY, setPosY] = useState(0)

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
    if(gunsList[3].active) {
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
    } else if(gunsList[2].active) {
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
    } else if(gunsList[1].active) {
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
    } else if(gunsList[0].active) {
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
    // pause
    if(event.code === 'Escape') {
      if (isPauseGame) {
        toggleIsPauseGame(false)
      } else {
        toggleIsPauseGame(true)
      }
    }

    // move
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
    // shooting
    if(event.code === 'Space') {
        console.log('space - fire');
        didMountNewBullet(posX, posY);
    }
    // set gun
    if(event.code === 'Digit1') {
      console.log('gun1');
      const gunsListTmp = gunsList;
      gunsListTmp.map(item => {
        return (item.active = false )
      })
      gunsListTmp[0].active = true

      setGunsList(gunsListTmp)
    }
    if(event.code === 'Digit2') {
      console.log('gun2');
      const gunsListTmp = gunsList;
      gunsListTmp.map(item => {
        return (item.active = false )
      })
      gunsListTmp[1].active = true

      setGunsList(gunsListTmp)
    }
    if(event.code === 'Digit3') {
      console.log('gun3');
      const gunsListTmp = gunsList;
      gunsListTmp.map(item => {
        return (item.active = false )
      })
      gunsListTmp[2].active = true

      setGunsList(gunsListTmp)
    }
    if(event.code === 'Digit4') {
      console.log('gun4');
      const gunsListTmp = gunsList;
      gunsListTmp.map(item => {
        return (item.active = false )
      })
      gunsListTmp[3].active = true

      setGunsList(gunsListTmp)
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
    if(isGameOver || isPauseGame || isStarting) {
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
    setIsStarting(false)
    setTimerSec(0)
    setTimerMin(0)
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
        <Space
          spaceType={spaceType}
          // setSpaceType={setSpaceType}
        />
        <Menu
          title="GAME OVER"
          startNewGame={startNewGame}
          spaceType={spaceType}
          setSpaceType={setSpaceType}
        />
        <Fullscreen />
        <Sounds
          toggleIsSounds={toggleIsSounds}
          isSounds={isSounds}
          changeSoundValue={changeSoundValue}
          soundValue={soundValue}
        />
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
        <Space
          spaceType={spaceType}
          setSpaceType={setSpaceType}
        />
        <Menu
          title="SPACE BATTLE"
          startNewGame={startNewGame}
          spaceType={spaceType}
          setSpaceType={setSpaceType}
        />
        <Fullscreen />
        <Sounds
          toggleIsSounds={toggleIsSounds}
          isSounds={isSounds}
          changeSoundValue={changeSoundValue}
          soundValue={soundValue}
        />
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
        <Space
          spaceType={spaceType}
          // setSpaceType={setSpaceType}
        />
        <Menu
          title="PAUSE"
          startNewGame={startNewGame}
          spaceType={spaceType}
          setSpaceType={setSpaceType}
        />
        <Fullscreen />
        <Sounds
          toggleIsSounds={toggleIsSounds}
          isSounds={isSounds}
          changeSoundValue={changeSoundValue}
          soundValue={soundValue}
        />
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
      <Space
          spaceType={spaceType}
          // setSpaceType={setSpaceType}
        />
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
          playExplosion={playExplosion}
        />
      ))}
      {/* уровень */}
      <Level changeLevel={changeLevel} />
      <Timer
        timerSec={timerSec}
        timerMin={timerMin}
        setTimerSec={setTimerSec}
        setTimerMin={setTimerMin}
      />
      <GunsPanel
        gunsList={gunsList}
      />
      {/* <Boss /> */}
    </AppContext.Provider>
  );
}

export default App;
