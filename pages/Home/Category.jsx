import React, { useEffect, useState } from 'react'

export default function Category({ emoji, name, select, selected }) { 
  const selectedStyle = {
    borderColor: "white"
  }


  return (
    <div className="category" style={selected ? selectedStyle : {}} onClick={select}>
      <span className="emoji-large" aria-label="emoji" role="img">{emoji}</span>
      <h1 className="category-name">
        {name}
      </h1>
    </div>
  )
}