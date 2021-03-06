import React, { useRef, useState, useEffect, useContext, useMemo } from 'react';

import { AppContext } from '../App';

// карабль
function Spaceship() {
  const { shipX, shipY, level } = useContext(AppContext);

  const [type, setType] = useState(1);
  const changeType = newType => setType(prev => newType);

  useEffect(() => {
    switch(level) {
      case 1:
        changeType(1)
        break;
      case 2:
        changeType(2);
        break;
      case 3:
        changeType(3);
        break;
      case 4:
        changeType(4);
        break;
      case 5:
        changeType(5);
        break;
      default:
        changeType(5);
    }
  }, [level]);

  return (
    <>
      <div
        id="ship"
        style={{ top: `${shipY}px`, left: `${shipX}px` }}
        className={`ship-type-${type}`}
      ></div>
    </>
  );
}

export default Spaceship;
