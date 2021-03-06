import React, { useRef, useState, useEffect, useContext, useMemo } from 'react';

import { AppContext } from '../App';
import useStickyState from '../utils/useStickyState'


// карабль
function Spaceship() {
  const { shipX, shipY, level } = useContext(AppContext);

  const [typeShip, setTypeShip] = useStickyState(1, 'typeShip');
  const changeTypeShip = newType => setTypeShip(prev => newType);

  useEffect(() => {
    switch(level) {
      case 1:
        changeTypeShip(1)
        break;
      case 2:
        changeTypeShip(2);
        break;
      case 3:
        changeTypeShip(3);
        break;
      case 4:
        changeTypeShip(4);
        break;
      case 5:
        changeTypeShip(5);
        break;
      default:
        changeTypeShip(5);
    }
  }, [level]);

  return (
    <>
      <div
        id="ship"
        style={{ top: `${shipY}px`, left: `${shipX}px` }}
        className={`ship-type-${typeShip}`}
      ></div>
    </>
  );
}

export default Spaceship;
