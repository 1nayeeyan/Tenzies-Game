import React from "react";
import { useState } from "react";
import Die from "./components/Die";
import Confetti from 'react-confetti';


function App() {
  const [dice, setDice] = useState(newDieNums())
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [lowestScore, setLowestScore] = useState(
    () => JSON.parse(localStorage.getItem("score")) || []
  )
  // const score=lowestScore[1]

  React.useEffect(() => {
    localStorage.setItem("score", JSON.stringify(lowestScore))
    // const scores = JSON.parse(localStorage.getItem("score")).sort()
    // scores = scores.sort()
    //  console.log(lowestScore)
  //   setLowestScore(scores)
  }, [lowestScore])

  React.useEffect(() => {

    let valueArr = []
    let heldArr = []

    for(let i = 0; i < 10; i++) {
      valueArr.push(dice[i].value)
      heldArr.push(dice[i].isHeld)
    }
    if ((valueArr.every(value => value === valueArr[0])) && (heldArr.every(bool => bool === true))){
      // console.log('won!')
      setTenzies(true)
    }

  }, [dice])

  function newDieNums() {
    const dieArray = []
    for(let i = 0; i < 10; i++) {
      let randomDie = Math.floor(Math.random() * (7 - 1) + 1);
      const newDieNums = {id: i, value: randomDie, isHeld: false}
      dieArray.push(newDieNums)
    }
    return dieArray
  }

  // console.log(dice)

  function rollDie() {
    setRollCount(prevRollCount => prevRollCount + 1)
    setDice(prevDie => prevDie.map(die => 
      die.isHeld? die : {...die, value: Math.floor(Math.random() * (7 - 1) + 1)} 
      ))
  }

  function holdDice(id) {
    setDice(prevDie => prevDie.map(die => 
      die.id === id ? {...die, isHeld:!die.isHeld} : die 
      ))
  }

  function newGame() {
    setLowestScore(prevScores => ([rollCount, ...prevScores]))
    // console.log(lowestScore)
    // setLowestScore(score => score.sort())
    setDice(newDieNums())
    setTenzies(false)
    setRollCount(0)
  }

  const diceElements = dice.map(die => 
    <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld} 
      holdDice={() => holdDice(die.id)}
    />)

  return (
    <div className="container">
      <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <h3 className="roll-counter">Rolls: {rollCount}</h3>
      <h3 className="low-roll-score">Lowest Score: {lowestScore.length === 0 ? 0 : Math.min.apply(Math, lowestScore)}
      </h3>
      <div className="container-sm die-grid">
          {diceElements}
      </div>
      <button className="roll-button" onClick={() => tenzies ? newGame() : rollDie()}>{tenzies ? "Play Again" : "Roll Die"} </button>
      </main>
    </div>
  );
}

export default App;
