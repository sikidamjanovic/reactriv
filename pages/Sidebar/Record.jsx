import React from 'react'
import '../../styles/sidebar.scss'

export default function Record({ place, name, score, date }) {
  return (
    <div className="record">
      <div className="record-details">
        <div className="record-place">
          {place === 1 
            ? <span className="emoji" aria-label="first-place" role="img">🥇</span>
            : place === 2
              ? <span className="emoji" aria-label="second-place" role="img">🥈</span>
              : place === 3 
                ? <span className="emoji" aria-label="third-place" role="img">🥉</span>
                : place
          }
        </div>
        <div>
          <p className="record-name">{name}</p>
          <p className="record-date">11/11/10</p>
        </div>
      </div>
      <h1 
        className="record-score" 
        style={{ 
          fontWeight: place > 3 ? '500' : '600',
          color: place === 1 
            ? "gold" 
            : place === 2 
              ? "#d1ccc0" 
              : place === 3 
                ? "#cd6133" 
                : null 
        }}
      >
        {score}
      </h1>
    </div>
  )
}