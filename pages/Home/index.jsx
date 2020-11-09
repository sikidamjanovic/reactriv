import React from 'react'
import '../../styles/home.scss'
import Category from './Category'
import { MdHelp } from 'react-icons/md'

export default function Home({ category, setCategory, categories, quizStarted, setQuizStarted }) {
  return (
    <div>
      <div className="header">
        <h1 className="header-text">
          Reactriv
        </h1>
        <div className="button-group">
          <button className="secondary-button">
            <MdHelp/>
          </button>
          <button onClick={() => setQuizStarted(true)} className="primary-button" disabled={!category}>
            {category && 
              <span className="emoji" aria-label="emoji" role="img">
                {categories.find(c => c.name === category).emoji}
              </span>
            }
            {category ? 'Start ' + category + ' Quiz' : 'Choose Category'}
          </button>
        </div>
      </div>
      <div className="categories">
        {categories.map(cat => 
          <Category 
            id={cat.name} 
            name={cat.name} 
            img={cat.img}
            emoji={cat.emoji}
            selected={category == cat.name}
            select={() => setCategory(cat.name)}
          />  
        )}
      </div>
    </div>
  )
}