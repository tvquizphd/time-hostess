import React from 'react'
import styles from './guide.module.css';

export const GuideDiv = (props) => {

  const key = 'sentiment'
  const colors = [
    'coolest', 'cooler', 'cool',
    'none',
    'warm', 'warmer', 'warmest'
  ]
  const range = {
    min: -3,
    max: 3
  }
  const valueToColor = (value) => {
    const offset = value - range.min
    const fraction = offset / (range.max - range.min)
    const colorIndex = Math.floor(fraction * colors.length)
    return colors[Math.max(0,Math.min(colors.length, colorIndex))]
  }

  const {textData} = props.node.data
  const {mean} = textData[key] || {mean: 0}

  const divStyle = styles[valueToColor(mean)]
  console.log({mean, divStyle})

  return (
    <div className={divStyle}>
      {props.children}
    </div>
  )
}
