import React, {useContext, useState} from 'react';

const GameContext = React.createContext()

// export const 

export const GameProvider = ({ children }) => {
  // const [] = useState()

  return (
    <GameContext.Provider value={{
      gameStatus, 
      soundStatus,
      lifesCount,
      scoreCount,
    }}>
      { children }
    </GameContext.Provider>
  )
}
