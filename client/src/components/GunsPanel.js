import React from 'react';

function GunsPanel(props) {

  return (
    <>
      <div className="guns-list">
        {props.gunsList.map((item, index) => {
          let activeClass = ''
          if (item.active) {
            activeClass = 'active'
          }
          return (
            <div className={`guns-item ${activeClass}`} key={index}>
              <h1 className="guns-item__heading">{item.id}</h1>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default GunsPanel;
