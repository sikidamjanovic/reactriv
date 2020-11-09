import React, { useEffect, useState, useRef } from 'react'
import firebase from '../api/firebase'
const axios = require('axios')
import '../../styles/quiz.scss'

export default function Quiz({ category, setQuizStarted, records, refreshRecords }) {
  const [ loading, setLoading ] = useState(true)
  const [ remainingTime, setRemainingTime ] = useState(10)
  const [ questions, setQuestions ] = useState()
  const [ questionNumber, setQuestionNumber ] = useState(0)
  const [ scoreArr, setScoreArr ] = useState([])
  const [ score, setScore ] = useState(0)
  const [ showRecordModal, setShowRecordModal ] = useState(false)
  const [ nameInput, setNameInput ] = useState('')

  const id = useRef(null);

  function endGame(){
    let lastPlace = records.length > 0 && records[records.length - 1]
    if(records.length < 8 || !lastPlace || lastPlace && score > lastPlace.score){
      setShowRecordModal(true)
    }else{
      alert('BOO')
    }
  }

  function fetchQuestions(id) {
    axios.get('https://opentdb.com/api.php?amount=50&category=' + id)
      .then(function(response){
        setQuestions(response.data.results);
        setLoading(false)
      })
      .catch(function(error){
        console.log(error);
      })
  }

  function handleOptionSelect(option){
    let correct = questions[questionNumber].correct_answer
    if(option === correct){
      setScore(score + 1)
      setScoreArr([...scoreArr, 1])
      setRemainingTime(remainingTime + 1)
    }else if(option === 'skip'){
      setScoreArr([...scoreArr, 3])
    }else{
      setScoreArr([...scoreArr, 2])
      setRemainingTime(remainingTime - 2)
    }
    setQuestionNumber(questionNumber + 1)
  }

  function handleInputChange(e){
    e.stopPropagation()
    e.preventDefault()
    setNameInput(e.target.value)
  }

  function submitScore(){
    if(!nameInput){
      alert('Add name!')
    }else{
      addRecord(nameInput, score)
    }
  }

  function addRecord(name, score){
    firebase.firestore().collection("records").doc().set({
      name: name,
      date: new Date().toUTCString(),
      score: score,
      category: category.toLowerCase()
    })
    .then(function() {
      setShowRecordModal(false)
      refreshRecords()
      setQuizStarted(false)
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    })
  }

  function formatHTML(option){
    return React.createElement("div", { dangerouslySetInnerHTML: { __html: option  }})
  };

  function clear(){
    window.clearInterval(id.current)
  }

  function getPlacement(){
    let placement = 0
    for (let i = 0; i <= records.length; i++) {
      if(i === records.length || records[i].score <= score){
        placement = i + 1
        break;
      }
    }
    return placement === 1 
      ? '1st'
      : placement === 2
        ? '2nd'
        : placement === 3
         ? '3rd'
         : placement + 'th'
  }

  useEffect(()=>{
    id.current = window.setInterval(()=>{
     setRemainingTime((time)=>time-1)
   },1000)
   return () => clear();
 },[])

 useEffect(()=>{
   if(remainingTime < 1){
     endGame()
   }
 },[ remainingTime ])

  useEffect(() => {
    let categoryID = ''
    switch (category) {
      case 'General':
        categoryID = 9
        break;
      case 'Film':
        categoryID = 11
        break;
      case 'Video Games':
        categoryID = 15
        break;
      case 'Computers':
        categoryID = 18
        break;
      case 'Television':
        categoryID = 14
        break;
      case 'Sports':
        categoryID = 21
        break;
      case 'History':
        categoryID = 23
        break;
      case 'Music':
        categoryID = 12
        break;
      case 'Geography':
        categoryID = 22
        break;
      default:
        break;
    }
    if(categoryID){
      fetchQuestions(categoryID)
    }
  }, [])

  return (
    <div>
      {showRecordModal &&
        <div className="modal">
          <div className="modal-content">
            <h1>Congrats! You scored <span>{score}</span> points.</h1>
            <p>That puts you in <span>{getPlacement()}</span> place all time.</p>
            <input onChange={(e) => handleInputChange(e)} placeholder="Enter name"/>
            <div className="modal-button-group">
              <button className="primary-button" onClick={() => submitScore()}>
                Submit Score
              </button>
              <button className="secondary-button" onClick={() => setQuizStarted(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      }
      {!loading && 
        <>
          <div className="header">
            <h1 className="header-text">
              {category}
            </h1>
            <div className="button-group">
              <button onClick={() => setQuizStarted(false)} className="secondary-button">
                Go Back
              </button>
              <button className="primary-button">
                Restart
              </button>
            </div>
          </div>
          <div className="quiz-header">
            <div className="quiz-score-wrap">
              {questions.map((q, index) => {
                if(typeof scoreArr[index] != 'undefined'){
                  return(
                    <div 
                      key={index}
                      className="quiz-score-tab" 
                      style={{ 
                        background: scoreArr[index] === 1 
                          ? 'green' 
                          : scoreArr[index] === 2 
                            ? 'red' 
                            : 'orange'
                      }}
                    />
                  )
                }else{
                  return(
                    <div 
                      key={index} 
                      className="quiz-score-tab" 
                    />
                  )
                }
              })}
            </div>
            <div 
              className="quiz-timer" 
              style={{ 
                color: remainingTime > 20 
                  ? 'white' 
                  : remainingTime > 10 
                    ? 'orange' 
                    : 'red' 
              }}
            >
              {remainingTime}s
            </div>
          </div>
          {!showRecordModal &&
            <>
              <div className="quiz-question-header">
                <div className="question-number">
                  {questionNumber}
                </div>
                <div className="question-text">
                  {formatHTML(questions[questionNumber].question)}
                </div>
              </div>
              <Options 
                current={questions[questionNumber]}
                select={handleOptionSelect}
                questions={questions}
                questionNumber={questionNumber}
                formatHTML={formatHTML}
              />
            </>
          }
        </>
      }
    </div>
  )
}

function Options({ current, select, formatHTML }) {
  const [ options, setOptions ] = useState()

  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
  }

  useEffect(() => {
    let arr = current.incorrect_answers
    arr.push(current.correct_answer)
    setOptions(shuffle(arr))
  }, [ current ])

  return(
    <div className="question-options">
      {options && options.map(opt => 
        <div onClick={() => select(opt)} className="question-option">
          {formatHTML(opt)}
        </div>
      )}
      <div onClick={() => select('skip')} className="question-skip">Skip</div>
    </div>
  )
}