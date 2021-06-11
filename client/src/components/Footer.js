import React, {
  // useRef,
  // useState,
  // useEffect,
  // useContext,
  // useMemo,
  // useReducer,
} from 'react';

// import logo from './assets/images/rs_school_js.svg';
import logo from '../../public/assets/images/rs_school_js.png';

function Fullscreen() {
  return (
    <footer>
      <div className="footer">
        <a
          href="https://github.com/harddownloader/"
          className="footer__link github-link"
        >
          <span>Github @harddownloader 2021</span>
        </a>
        <a href="https://rs.school/js/" className="footer__link course-link">
          <img
            src={logo}
            // src={require('../public/assets/images/rs_school_js.png')}
            // src={require('./assets/images/rs_school_js.svg')}
            alt="rs school"
            height="50"
            className="footer__logo"
          />
        </a>
      </div>
    </footer>
  );
}

export default Fullscreen;
