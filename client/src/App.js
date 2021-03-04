import React, { useRef, useState, useEffect, useContext, useMemo, useReducer } from 'react';
// import jQuery from 'jquery';
import './App.scss';

// жизни
import Lifes from './components/Lifes'
// полоска жизни
import LifeBar from './components/LifeBar'
// очки игрока
import Score from './components/Score'
// карабль игрока
import Spaceship from './components/Spaceship'
// выстрелы карабля
import Bullet from './components/Bullet'


export const AppContext = React.createContext();

function App() {
  // кол-во жизней
  const [lifes, setLifes] = useState(3);
  // для изменения кол-ва жизней
  const changeLifes = (count) => setLifes(prev => count)

  // очки игрока
  const [score, setScore] = useState(0);
  // для изменения кол-ва жизней
  const changeScore = (newScore) => setScore(prev => newScore)

  // уровень жизни(полоска) - 200px
  const [lifeValue, setLifeValue] = useState(200);
  // для изменения уровеня жизни(полоска)
  const changeLifeValue = (count) => setScore(prev => count)


  // координаты карабля
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  // координаты выстрела
  const [posBulletX, setPosBulletX] = useState(0);
  const [posBulletY, setPosBulletY] = useState(0);
  const [bullets, setBullets] = useState([])

  // добавляем новый выстрел в список выстрелов
  const addBulletToList = () => {
    setBullets([
      ...bullets,
      {
        id: bullets.length,
        x: posBulletX,
        y: posBulletY
      }
    ]);
  };

  useEffect(() => {
    // console.log('componentDidMounted');
    window.addEventListener('mousemove', mouseMoveHandler)
    window.addEventListener('mousedown', mouseDownHandler)
    // shipRect = document.getElementById('ship').getBoundingClientRect();
    // shipRect = document.getElementById('life').getBoundingClientRect();
    // console.log('shipRect', shipRect);

    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler)
      window.removeEventListener('mousedown', mouseDownHandler)
    }
  });

  const mouseMoveHandler = (event) => {
    setPosX(event.clientX)
    setPosY(event.clientY)
  }

  const mouseDownHandler = (event) => {
    console.log('mouseDownHandler')
    setPosBulletX(event.clientX)
    setPosBulletY(event.clientY)
    addBulletToList()
  }
  

  // const authContext = useMemo(
  //   () => ({
  //     getShipRect: () => {
  //       console.log('shipRect in memo', shipRect)
  //       return shipRect;
  //     },
  //   }),
  //   [shipRect]
  // );

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
      {bullets.map(item => (
        <Bullet key={item.id} x={item.x} y={item.y}/>
      ))}
      <LifeBar />
    </AppContext.Provider>
  );
}


export default App;
