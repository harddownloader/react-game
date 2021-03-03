import React, { useRef, useState, useEffect, useContext } from 'react';

import {AppContext} from '../App'

function Lifes() {
  // console.log('lifes render')

  const {lifesCount} = useContext(AppContext)

  const lifesList = []

  for (let i=0; i<lifesCount; i++) {
    lifesList.push( <div id="life" key={i}></div>)
  }


  return (
    <>
      <div id="lifes">
        { lifesList }
      </div>
    </>
  );
}

export default Lifes;
