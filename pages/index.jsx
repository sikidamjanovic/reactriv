import React, { useEffect, useState } from 'react'
import '../styles/main.scss'
import Home from './Home'
import Sidebar from './Sidebar/index.jsx'
import Quiz from './Quiz/index.jsx'
import firebase from './api/firebase'

export default function Main() {
  const [ quizStarted, setQuizStarted ] = useState(false)
  const [ category, setCategory ] = useState("General")
  const [ records, setRecords ] = useState()
  const [ recordsLoading, setRecordsLoading ] = useState(true)

  const categories = [
    { emoji: '🔍', name: "General"},
    { emoji: '🎬', name: "Film"},
    { emoji: '👾', name: "Video Games" },
    { emoji: '💻', name: "Computers" },
    { emoji: '📺', name: "TV" },
    { emoji: '🏈', name: "Sports" },
    { emoji: '📕', name: "History" },
    { emoji: '🎹', name: "Music" },
    { emoji: '🌎', name: "Geography"}
  ]

  function fetchRecords() {
    setRecordsLoading(true)
    firebase.firestore()
    .collection("records")
    .where("category", "==", category.toLowerCase())
    .orderBy("score", "desc")
    .get()
    .then(function(querySnapshot){
      let records = []
      querySnapshot.forEach(function(doc){
        records.push(doc.data())
      })
      console.log(records)
      setRecords(records)
      setRecordsLoading(false)
   })
  }

  useEffect(() => {
    fetchRecords()
  }, [ category ])

  return (
    <div className="background">
      <div className="main">
        {!quizStarted ?
          <Home 
            category={category} 
            setCategory={setCategory}
            categories={categories}
            quizStarted={quizStarted}
            setQuizStarted={setQuizStarted}
          /> :
          <Quiz
            category={category}
            setQuizStarted={setQuizStarted}
            records={records}
            refreshRecords={fetchRecords}
          />
        }
      </div>
      <div className="sidebar">
        <Sidebar 
          category={category}
          emoji={categories.find(c => c.name === category).emoji}
          records={records}
          loading={recordsLoading}
        />
      </div>
    </div>
  )
}