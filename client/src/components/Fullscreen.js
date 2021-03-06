import React, { useState, useEffect } from 'react';
import useStickyState from '../utils/useStickyState'


function Fullscreen() {
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const [isFullScreen, setIsFullScreen] = useStickyState(false, 'isFullScreen');
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
