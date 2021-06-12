import React from 'react';
import App from '../src/App.js';
import Head from 'next/head'

function HomePage() {
  return (
    <>
      <Head>
        <title>Spaceships Game</title>
        <meta name="keywords" content="React Spaceships Game" />
        <meta name="description" content="React Spaceships Game" />
        <meta charSet="utf-8" />
      </Head>
      <App/>
    </>
  )
}

export default HomePage
