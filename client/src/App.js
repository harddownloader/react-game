import React, { useRef, useState, useEffect, useContext, useMemo } from 'react';
// import jQuery from 'jquery';
import './App.scss';

// utils
import useKeyPress from './utils/useKeyPress'

// жизни
import Lifes from './components/Lifes'
// полоска жизни
import LifeBar from './components/LifeBar'
// очки игрока
import Score from './components/Score'
// карабль игрока
import Spaceship from './components/Spaceship'




// -------------------------------

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
  let shipX = useRef(null)
  // const [shipX, setShipX] = useState(null);
  // для изменения 
  // const changeShipX = (newX) => setShipX(prev => newX)

  let shipY = useRef(null)
  // const [shipY, setShipY] = useState(null);
  // для изменения 
  // const changeShipY = (newY) => setShipY(prev => newY)


  // const pressTop = null
  // const pressDown = null
  // const pressRight = null
  // const pressZ = null
  // const pressLeft = null
  const pressTop = useKeyPress('w');
  const pressDown = useKeyPress('s');
  const pressRight = useKeyPress('d');
  const pressLeft = useKeyPress('a');

  // console.log('pressTop', pressTop)
    


  // let starterY = (window.innerHeight/0.7).toFixed(3);
  // let starterX = (window.innerWidth/0.5).toFixed(3);
  console.log('app render')

  useEffect(() => {
    


    const shipRect = document.getElementById('ship').getBoundingClientRect();
    console.log('shipRect', shipRect)
    shipY.current = shipRect.y;
    shipX.current = shipRect.x;

    // let starterY = (window.innerHeight/0.7).toFixed(3);
    // let starterX = (window.innerWidth/0.5).toFixed(3);
  });

  useEffect(() => {
    console.log('press w' + shipY.current)
    shipY.current = shipY.current + 10
    // return () => {
    //   cleanup
    // };
  }, [pressTop]);
  useEffect(() => {
    console.log('press s' + shipY.current)
    shipY.current = shipY.current  - 10
    // return () => {
    //   cleanup
    // };
  }, [pressDown]);
  useEffect(() => {
    console.log('press d' + shipX.current)
    shipX.current = shipX.current  + 10
    // return () => {
    //   cleanup
    // };
  }, [pressRight]);
  useEffect(() => {
    console.log('press a' + shipX.current)
    shipX.current = shipX.current  - 10
    console.log('shipX.current', shipX.current)
    console.log('shipY.current', shipY.current)
    // return () => {
    //   cleanup
    // };
  }, [pressLeft]);

  return (
    <AppContext.Provider value={{
      lifesCount: lifes,
      scoreCount: score,
      lifeValue: lifeValue,
      shipX: shipX.current,
      shipY: shipY.current
    }}>
      <div className="sky"></div>
      <Lifes />
      <Score />
      <Spaceship x={shipX.current} y={shipY.current}/>

      <LifeBar />
    </AppContext.Provider>
  );
}

export default App;
