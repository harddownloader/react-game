import React, {useState, useEffect} from 'react';

function Sounds(props) {

  const soundsHandler = () => {
    props.toggleIsSounds(!props.isSounds)
  }

  const getSoundClasType = () => {
    if(props.isSounds) {
      return 'sounds-on'
    } else {
      return 'sounds-off'
    }
  }

  return (
    <>
      <button className={`sounds ` + getSoundClasType()} onClick={e => soundsHandler()} ></button>
    </>
  )
}

export default Sounds;
