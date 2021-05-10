import React, {
  // useRef,
  // useState,
  // useEffect,
  // useContext,
  // useMemo,
  // useReducer,
} from 'react';

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

  const changeVolumeHandler = (value) => {
    // console.log(value)
    props.changeSoundValue(value)
    if (value > 0) {
      props.toggleIsSounds(true);
    } else {
      props.toggleIsSounds(false);
    }
  };
 

  return (
    <>
      <div className="sounds-volume">
        <button
          className={`sounds ${getSoundClasType()}`}
          onClick={e => soundsHandler()}
        ></button>
      
        <input type="range" id="sounds-volume-ranger" name="volume"
          min="0" max="1" step="0.1" value={props.soundValue} onChange={e => {changeVolumeHandler(e.target.value)} } />
      </div>
    </>
  );
}

export default Sounds;
