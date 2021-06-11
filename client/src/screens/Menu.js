import React, {
  // useRef,
  // useState,
  // useEffect,
  useContext,
  // useMemo,
  // useReducer,
} from 'react';
import useStickyState from '../utils/useStickyState'
import { AppContext } from '../App';

function Menu(props) {
  const { level, score, records } = useContext(AppContext);

  const [selected, setSelected] = useStickyState('easy', 'selected');
  // const [selectedBg, setSelectedBg] = useStickyState(1, 'selectedBg');

  const onValueChange = event => {
    setSelected(event.target.value);
  };

  const onValueChangeBg = event => {
    props.setSpaceType(event.target.value);
  };

  const getTextToContinueGame = () => {
    return (<p className="sub-title" >Press "Esc" to continue game</p>)
  }

  const getScoreResult = () => {
      return (<p className="sub-title" >Your score:  <span className="menu-score-result" >{score}</span></p>)
  }

  const getLvlResult = () => {
    return(<p className="sub-title" >Your lvl: <span className="menu-lvl-result" >{level}</span></p>)
  }

  const getFirstSubTitle = () => {
    if (props.title === 'PAUSE') {
      return getTextToContinueGame()
    } else {
      return getScoreResult()
    }
  }

  const getSecondSubTitle = () => {
    if (props.title === 'PAUSE') {
      return(<p className="sub-title" >OR start new game:</p>)
    } else {
      return getLvlResult()
    }
  }

  return (
    <>
      <div id="menu">
        <div className="menu__heading">
          <h1 className="menu__title">{props.title}</h1>
          {getFirstSubTitle()}
          {getSecondSubTitle()}
        </div>

        <div className="menu__wrap">
          <button className="menu__btn" onClick={e => props.startNewGame(selected)}>
            New Game
          </button>

          <div className="table-records">
            <h3 className="records-title">Top 5 records:</h3>

            {records.length >= 1 ?
            records.map((item, index) => {
              return (
                <p className="record-item" key={index}>
                  <span className="record-number">{index + 1}. </span>
                  <span className="record-date">{item.recordDate}</span> -
                  <span className="record-score"> {item.recordValue}</span>
                </p>
              )
            })
            : <p className="record-item">no records yet...</p>}
          </div>

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

          {/* bg image */}
          <p className="difficulty-lvl__heading">
              Select theme:
          </p>
          <div className="difficulty-lvl__item">
              <input
                type="radio"
                id="bg_image1"
                name="bg_image1"
                value="1"
                checked={props.spaceType === "1"}
                onChange={onValueChangeBg}
              />
              <label htmlFor="bg_image1">Theme 1</label>
            </div>

            <div className="difficulty-lvl__item">
              <input
                type="radio"
                id="bg_image2"
                name="bg_image2"
                value="2"
                checked={props.spaceType === "2"}
                onChange={onValueChangeBg}
              />
              <label htmlFor="bg_image2">Theme 2</label>
            </div>
        </div>
      </div>
    </>
  );
}

export default Menu;
