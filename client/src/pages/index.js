import React, { Component } from 'react';
import '../index.scss';
import PlayGame from '../screens/PlayGame';

export default function Home() {
  return (
    <div className="container space">
      <PlayGame />
    </div>
  );
}
