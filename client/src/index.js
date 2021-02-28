import React from 'react';
import ReactDOM from 'react-dom';

import App from './pages/index.js';

import 'normalize.css';

// render(<Index/>, document.getElementById('root'));
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);