import React, { useState, useEffect } from 'react';

function Sounds(props) {
  // ставим новое значение звуку в игре
  const soundsHandler = () => {
    props.toggleIsSounds(!props.isSounds);
  };

  // ставинум нужный класс для отображения вкл./выкл. иконки звук
  const getSoundClasType = () => {
    if (props.isSounds) {
      return 'sounds-on';
    }
    return 'sounds-off';
  };

  return (
    <>
      <button
        className={`sounds ${getSoundClasType()}`}
        onClick={e => soundsHandler()}
      ></button>
    </>
  );
}

export default Sounds;
