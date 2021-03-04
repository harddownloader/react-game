import React, { useRef, useState, useEffect, useContext, useMemo } from 'react';

import {AppContext} from '../App'

// карабль
function Spaceship() {

  const {shipX, shipY} = useContext(AppContext)


  // useEffect(() => {
  //   console.log('new x' + shipX)
  // }, [shipX]);

  // useEffect(() => {
  //   console.log('new y' + shipY)
  // }, [shipY]);

  return (
    <>
      <div id="ship" style={{top: shipY + 'px', left: shipX + 'px'}}></div>
      {/* <div id="ship"></div> */}
    </>
  )
}

export default Spaceship;
