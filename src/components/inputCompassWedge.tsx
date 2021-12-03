import React from 'react'
import {
  angleBetween
} from '../lib/angleUtil'
import {
  selectFromList
} from '../lib/selectFromList'
import {
  clicker 
} from '../lib/clicker'
import styles from './inputCompassWedge.module.scss'

// Must match css
const d2 = 2
const d180 = 180
const numSteps = 1 + d180/d2
const every2deg = Array.from(Array(numSteps).keys()).map(i=>d2*i)

const InputCompassWedge = (props) => {
  const { steps, range, category, wedgeClass } = props
  const { wedge } = category

  const toggleClick = clicker({category, range, steps})

  const between = angleBetween(wedge)
  const centerAngle = between.mean
  const wedgeAngle = selectFromList({
    items: every2deg,
    value: between.diff,
    range: {min: 0, max: d180},
  })

  const wedgeStyle = {
    transform: `rotate(${centerAngle}deg)`
  }
  const className = [
    ...wedgeClass.wedge,
    styles.wedge,
    styles[`wedge-${wedgeAngle}deg`]
  ].join(' ')

  return (
    <div onClick={toggleClick} style={wedgeStyle} className={className}/>
  )
}

export default InputCompassWedge
