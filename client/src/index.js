// babel
import 'core-js';
import 'regenerator-runtime/runtime';
// app

import React from 'react';
// import ReactDOM from 'react-dom';
// https://lihautan.com/hydrating-text-content/
import { hydrate } from "react-dom"


// import Index from './pages/index.js';
import App from './App';

import 'normalize.css';

// render(<Index/>, document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));
hydrate(<App />, document.getElementById('root'))
