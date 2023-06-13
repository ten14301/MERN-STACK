import React from "react"
import "./ฺButton.css"

function Button({ onClick, children }) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div className="btn">
    <button className="add-btn" onClick={handleClick}>
      {children}
    </button>
    </div>
  )
}

export default Button
