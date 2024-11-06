import React, { useEffect, useState, useRef } from "react";

const Wordle = () => {
  const rows = 6;
  const cols = 5;
  const [matrix, setMatrix] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(""))
  );
  const inputRef = useRef(null);
  let [count, setCount] = useState(0);
  const [userGuessCount, setUserGuessCount] = useState(6);
  // const [word, setWord] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const [win, setWin] = useState(false);
  const [hint, setHint]= useState(localStorage.getItem('wordHint'));
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch(
          "https://api.frontendexpert.io/api/fe/wordle-words"
        );
  
        
        const data = await res.json();
        const dataLen = Math.floor(Math.random() * data.length);
        console.log("dataLen", dataLen);
        
        console.log("random word", data[dataLen]);
        const randomWord = data[dataLen];
        // setWord(randomWord);
        localStorage.setItem("randomWord", randomWord);
        localStorage.setItem("date", new Date().toLocaleDateString("en-GB"));
        const hintApi = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
        const hintRes = await hintApi.json();
        localStorage.setItem("wordHint", hintRes[0].meanings[0].definitions[0].definition)
        console.log("checking full b data",hint);
        setHint(localStorage.getItem('wordHint'));
        console.log("fetching exact definition", hintRes[0].meanings[0].definitions[0].definition);
        console.log("check word", data);
      } catch (error) {
        console.log(error);
      }
    };

    if (
      !localStorage.getItem("randomWord") ||
      localStorage.getItem("date") != new Date().toLocaleDateString("en-GB")
    ) {
      fetchWord();
    }
  }, []);

  const handleChange = (e, row, col) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = e.target.value;

    if (e.target.value) {
      count += 1;
      setCount(count);
    } else {
      count -= 1;
      setCount(count);
    }
    setMatrix(newMatrix,);
    console.log(newMatrix);
    // if (count == 5) {
    //   setTimeout(() => {
    //     console.log("checking newMatrix insde count", newMatrix[row]);
    //     const guessWord = newMatrix[row];
    //     matchWord(guessWord, row);
    //     setCount(0);
    //   }, 1000);
    // }
  };

  const handleEnter = () => {
    console.log("checking va;ue of count inside handleEnter", count);
    
    if (count == 5) {

        console.log("checking newMatrix inside count", matrix[currentRow]);
        const guessWord = matrix[currentRow];
        matchWord(guessWord, currentRow);
        setCount(0);
        setCurrentRow(currentRow + 1);
        setUserGuessCount(userGuessCount-1);

    }
  };

let arr=[];

  const matchWord = (guessWord, row) => {
    console.log("checking row insode matchwORd function", row);
    let guessWordToCheck = guessWord.map((c) => {
      return c.toUpperCase();
    });
    let todayWord = localStorage.getItem("randomWord").split("");
    for (let i = 0; i < guessWordToCheck.length; i++) {
      var style = document.getElementById(`input${row}${i}`);
      if (guessWordToCheck[i] == todayWord[i]) {
        arr.push(guessWordToCheck[i]);
        if(arr.length==5){
          setWin(true)
        }
        // console.log("checking arr length", arr);
        
        // arr.forEach((item)=>{
        //   console.log("checking arr elements", item);
          
        // })
        
        style.setAttribute("style", "color:white; background-color: #008000;");
      } else if (todayWord.includes(guessWordToCheck[i])) {
        style.setAttribute("style", "color:white; background-color: #bcbc15;");
      } else {
        style.setAttribute("style", "color:white; background-color: #818181;");
      }
    }
  };
  return (
    <>
      <div className="container text-center d-flex justify-content-center align-items-center vh-100">
          <div className="word-hint mb-3">
            <p className="m-0"><strong>Word Hint: </strong> {hint}</p>
          </div>
        <div>
         
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="row justify-content-center mb-1">
              {row.map((cell, colIndex) => (
                <div key={colIndex} className="col-1 p-0 m-1">
                  <input
                    id={`input${rowIndex}${colIndex}`}
                    type="text"
                    value={cell}
                    maxLength={1}
                    ref={inputRef}
                    className="form-control text-center"
                    onChange={(e) => handleChange(e, rowIndex, colIndex)}
                  />
                </div>
              ))}
            </div>
          ))}
          <div className="row mt-3 footer">
            <div className="col-md-3">
              <div className="attempts">

              {win ? (
                <p className="m-0">You guessed it right!</p>
              ) : (userGuessCount === 0 && !win)? (
                <p className="m-0">Better luck next time</p>
              ) : (
                <p className="m-0">You have {userGuessCount} attempts left</p>
              )}
             
                  </div>
            </div>
            <div className="col-md-2">
              <div className="enterBtn">
                <button type="button" className="btn btn-primary btn-lg" onClick={handleEnter}>
                  Enter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wordle;
