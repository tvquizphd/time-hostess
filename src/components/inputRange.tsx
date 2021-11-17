import React from 'react'
import {
  toDomain,
  makeRangeSetter
} from '../lib/rangeSetter'
import styles from './inputRange.module.css'
import Content from './content'

const InputRange = (props) => {
  const className = props.cls[0]
  const buttonClass = props.cls[1]
  const { limit, setter, value } = props
  const valueSetter = makeRangeSetter({limit, setter})
  const inputValue = toDomain(limit, value)
  const bounds = {
    min: 0,
    max: 1
  }
  const step = 0.05
  const bigStep = 0.2
  return (
    <div>
			<div>{props.label}</div>
			<div className={[styles.rangeContainer, className].join(' ')}>
				<button className={`${styles.round} ${styles.down}`}
          onClick={() => {
						valueSetter(inputValue - bigStep)
          }}>
          -
        </button>
				<input 
					type="range" 
					min={bounds.min + step}
					max={bounds.max}
					value={inputValue} 
					onChange={(event) => {
						const {value} = event.target
						valueSetter(value)
					}}
					step={step}/>
				<button className={`${styles.round} ${buttonClass}`}
          onClick={() => {
						valueSetter(inputValue + bigStep)
          }}>
          +
        </button>
			</div>
    </div>
  )
}

export default InputRange
