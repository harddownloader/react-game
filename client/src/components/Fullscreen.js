import React, {
  // useRef,
  useState,
  useEffect,
  // useContext,
  // useMemo,
  // useReducer,
} from 'react';
// import useStickyState from '../utils/useStickyState'


function Fullscreen() {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const [isFullScreen, setIsFullScreen] = useState(false)
  const toggleIsFullScreen = status => setIsFullScreen(prev => status);

  useEffect(() => {
    if (isFullScreen) {
      toggleFullScreen();
    }
  }, [isFullScreen]);

  return (
    <>
      <button
        className="fullscreen"
        onClick={e => toggleIsFullScreen(!isFullScreen)}
      ></button>
    </>
  );
}

export default Fullscreen;
