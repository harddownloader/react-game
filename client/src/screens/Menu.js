import React from 'react';

function Menu(props) {
  return (
    <>
      <div id="menu">
        <div className="menu__heading">
          <h1 className="menu__title">{ props.title }</h1>
        </div>
        
        <div className="menu__wrap">
          <button className="menu__btn" onClick={e => props.startNewGame()}>New Game</button>
        </div>
      </div>
    </>
  )
}

export default Menu;


