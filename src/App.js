import { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

/***
 * Done: Senin, 30 Mei 2022
 * 
 * Idea to improve?
 * - CSS: put real dots on the dice
 * - Track the number of roll
 * - Track the time took to win
 * - Save your besttime to LocalStorage
 * 
 * 
 * To Do?
 * - Make it live
 */

function App() {

  const [dices, setDices] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [roll, setRoll] = useState(0)

  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 6 + 1),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    let newDices = [];
    for (let i = 0; i < 10; i++) {
      newDices.push(generateNewDie());
    }
    return newDices;
  }

  useEffect(() => {
    // my solution:
    // let allHeld = false;
    // let allSame = false;
    // let countHeld = 0;
    // let countMatch = 0;
    // for (let i = 0; i < dices.length; i++) {
    //   if (dices[i].isHeld) countHeld++;
    //   if (dices[0].value === dices[i].value) countMatch++;
    // }
    // if (countHeld == 10) allHeld = true;
    // if (countMatch == 10) allSame = true;

    // better way to do:
    const allHeld = dices.every((die) => die.isHeld);
    const firstValue = dices[0].value;
    const allSame = dices.every((die) => die.value === firstValue);

    if (allHeld && allSame) {
      console.log("YOU WIN");
      setTenzies(true);
      localStorage.setItem("record", roll.toFixed())
    }
  }, [dices, roll]);

  const diesElements = dices.map((dice) => (
    <Die
      key={dice.id}
      value={dice.value}
      isHeld={dice.isHeld}
      holdDice={() => holdDice(dice.id)}
    />
  ));

  function resetGame() {
    setTenzies(false);
    setDices(allNewDice());
    setRoll(0)
  }

  function rollDice() {
    setDices((oldDices) => {
      return oldDices.map((oldDice) =>
        !oldDice.isHeld ? generateNewDie() : oldDice
      );
    });
    setRoll(oldRoll => oldRoll += 1)
  }

  function holdDice(id) {
    setDices((oldDices) => {
      return oldDices.map((oldDice) =>
        id === oldDice.id ? { ...oldDice, isHeld: !oldDice.isHeld } : oldDice
      );
    });
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <small className="note">Last roll: {localStorage.getItem("record")}x</small>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diesElements}</div>
      <button 
      className="roll-dice" 
      onClick={tenzies ? resetGame : rollDice}
      >
        {tenzies ? "New Game" : "Roll "}

      </button>
    </main>
  );
}

export default App;
