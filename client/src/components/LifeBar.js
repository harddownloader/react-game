import React, { useRef, useState, useEffect, useContext } from 'react';

import {AppContext} from '../App'

function LifeBar() {

  const {lifeValue} = useContext(AppContext)

  return (
    <>
      <div className="life-bar-cont">
        <div className="life-bar">
          <div className="inside-bar" style={{height: lifeValue + 'px'}}></div>
        </div>
      </div>
    </>
  );
}

export default LifeBar;
