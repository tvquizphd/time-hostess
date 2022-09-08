import React from 'react'
import {
  toDomain,
  makeRangeSetter
} from '../lib/rangeSetter'
import {
  clicker 
} from '../lib/clicker'
import styles from './inputRange.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'


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
  const { limit, category, hideRange } = props
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
  const inputContent = makeRange({
    range, steps, inputValue,
    onChange: handler({valueSetter})
  })
  const buttonMinusClass = [
    styles.round, styles.down
  ].join(' ')
  const buttonPlusClass = [
    styles.round,
    ...props.cls.plus
  ].join(' ')
  const className = [
    styles['rangeContainer'],
    ...props.cls.root
  ].join(' ')

  const divProps = {
    className,
  }
  return (
    <div className={styles.rangeWrapper}>	
			<div className={className}>
				<button className={buttonMinusClass}
          onClick={minusClick}>
          <FontAwesomeIcon icon={faEyeSlash} />
        </button>
        {inputContent}
				<button className={buttonPlusClass}
          onClick={plusClick}>
          <FontAwesomeIcon icon={faEye} />
        </button>
			</div>
    </div>
  )
}

export default InputRange
