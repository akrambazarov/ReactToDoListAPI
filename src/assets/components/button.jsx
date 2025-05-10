import React from 'react'

const Button = ({icon,className,onClick}) => {
  return (
    <button 
    onClick={onClick}
    className={`${className} text-gray-500 hover:text-gray-700 transition-colors`}>{icon}</button>
  )
}

export default Button