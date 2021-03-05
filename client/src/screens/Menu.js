import React, { useState } from 'react';

function Menu(props) {
  const [selected, setSelected] = useState('easy');

  const onValueChange = event => {
    setSelected(event.target.value);
  };

  // const formSubmit(event) {
  //   event.preventDefault();
  //   console.log(this.state.selectedOption)
  // }

  return (
    <>
      <div id="menu">
        <div className="menu__heading">
          <h1 className="menu__title">{props.title}</h1>
        </div>

        <div className="menu__wrap">
          <button className="menu__btn" onClick={e => props.startNewGame()}>
            New Game
          </button>

          {/* lvl */}
          <form>
            <p className="difficulty-lvl__heading">
              Select the difficulty level:
            </p>

            <div className="difficulty-lvl__item">
              <input
                type="radio"
                id="easy"
                name="easy"
                value="easy"
                checked={selected === 'easy'}
                onChange={onValueChange}
              />
              <label htmlFor="easy">Easy</label>
            </div>

            <div className="difficulty-lvl__item">
              <input
                type="radio"
                id="medium"
                name="medium"
                value="medium"
                checked={selected === 'medium'}
                onChange={onValueChange}
              />
              <label htmlFor="medium">Medium</label>
            </div>

            <div className="difficulty-lvl__item">
              <input
                type="radio"
                id="hard"
                name="hard"
                value="hard"
                checked={selected === 'hard'}
                onChange={onValueChange}
              />
              <label htmlFor="hard">Hard</label>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Menu;
