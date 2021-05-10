import React from 'react';
import Lifes from '../components/Lifes';
import Score from '../components/Score';
import Spaceship from '../components/Spaceship';

function PlayGame() {
  return (
    <>
      <Lifes />
      <Score />
      <Spaceship />
    </>
  );
}

export default PlayGame;
