import React from 'react'
import {
  toDomain,
  makeRangeSetter
} from '../lib/rangeSetter'
import {
  clicker 
} from '../lib/clicker'
import styles from './inputRange.module.css'

const makeRange = ({range, onChange, steps, inputValue}) => {
  return (
    <input 
      type="range" 
      min={range.min + steps.small}
      max={range.max}
      value={inputValue} 
      onChange={onChange}
      step={steps.small}
    />
  )
}

const handler = ({valueSetter}) => {
  return (event) => {
    const {value} = event.target
    valueSetter(parseFloat(value))
  }
}

const InputRange = (props) => {
  const { limit, label, category, hideRange } = props
  const { setter, value, canClear } = category
  const valueSetter = makeRangeSetter({limit, setter})
  const inputValue = toDomain(limit, value)
  const range = {
    min: 0,
    max: 1
  }
  const steps = {
    big: 0.25,
    small: 0.05
  }

  const minusClick = () => {
    valueSetter(inputValue - steps.big)
  }
  const plusClick = () => {
    valueSetter(inputValue + steps.big)
  }
  const toggleClick = clicker({category, range, steps})

  const labelClass = props.cls.label.join(' ')
  const closeX = canClear? '× ' : null
  const spans = closeX ? [closeX, label] : [label]
  const labelContent = (
    <button className={labelClass} onClick={toggleClick}>
      {spans.map((k,i) => <span key={i}>{k}</span>)}
    </button>
  )
  const inputContent = makeRange({
    range, steps, inputValue,
    onChange: handler({valueSetter})
  })
  const topContent = !hideRange ? labelContent : null
  const coreContent = !hideRange ? inputContent : labelContent
  const containerName = !hideRange ? 'range' : 'label'

  const buttonMinusClass = [
    styles.round, styles.down
  ].join(' ')
  const buttonPlusClass = [
    styles.round,
    ...props.cls.plus
  ].join(' ')
  const className = [
    styles[containerName+'Container'],
    ...props.cls.root
  ].join(' ')

  return (
    <div>	
      {topContent}
			<div className={className}>
				<button className={buttonMinusClass}
          onClick={minusClick}>
          -
        </button>
        {coreContent}
				<button className={buttonPlusClass}
          onClick={plusClick}>
          +
        </button>
			</div>
    </div>
  )
}

export default InputRange
