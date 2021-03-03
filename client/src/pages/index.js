import React, { Component } from 'react';
// import logo from '../assets/logo.png';
// import logo from '../assets/images/logo.png';
import '../index.scss';
import PlayGame from '../screens/PlayGame';

export default function src() {
  return (
    <div className="container space">
      <h1>Hello World!</h1>
      {/* <img src={logo} alt="" /> */}
      <PlayGame />
    </div>
  );
}
