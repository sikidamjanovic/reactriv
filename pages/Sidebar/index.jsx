import React from 'react'
import Record from './Record'
import ClipLoader from "react-spinners/ClipLoader";
import '../../styles/sidebar.scss'

export default function Sidebar({ category, records, emoji, loading }) {
  return (
    <div>
      <div className="header">
        <h1 className="header-text">
          <span className="emoji" aria-label="crown" role="img">👑</span>
          Top 8 in {category}
          <span className="emoji" aria-label="emoji" role="img" style={{ marginLeft: '0.5em' }}>{emoji}</span>
        </h1>
      </div> 
      <div className="records-list">
        {!loading && records
          ? records.map((record, index) => 
              <Record 
                key={index}
                place={index + 1} 
                name={record.name} 
                score={record.score} 
                // date={record.date}
              />  
            )
          : <div className="records-loading">
              <ClipLoader color="#06273d"/>
            </div>
        }
      </div>
    </div>
  )
}