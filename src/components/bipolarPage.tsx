import React, { useState } from 'react'
import styles from './bipolarPage.module.scss'
import {
  toDomain,
  makeRangeSetter
} from '../lib/rangeSetter'
import {
  extractGuidance
} from '../lib/extractor'
import {
  selectFromList
} from '../lib/selectFromList'

import InputRange from './inputRange'
import Content from './content'

const valueToStyle = (options) => {
  const {range} = options
  const value = extractGuidance(options)
  const colors = [
    'coolest', 'cooler', 'cool',
    'none',
    'warm', 'warmer', 'warmest'
  ]
  const color = selectFromList(value, range, colors)
  return styles[color]
}

const BipolarPage = (props) => {

  const [rangeMin, setRangeMin] = useState(-0.5)
  const [rangeMax, setRangeMax] = useState(0.5)

  return (
    <div className={styles.mainContainer}>
			<div className={styles.controlContainer}>
				<InputRange {...{
          cls: ['warmer-range', 'warmest'].map(k=>styles[k]),
          setter: setRangeMax, value: rangeMax, limit: [+1, 0],
          label: "Optimism"
        }}/> 
				<InputRange {...{
          cls: ['cooler-range', 'coolest'].map(k=>styles[k]),
          setter: setRangeMin, value: rangeMin, limit: [-1, 0],
          label: "Pessimism"
        }}/> 
			</div>
      <div className={styles.contentContainer}>
        <Content {...{
          ...props,
          valueToStyle,
          range: {
            min: rangeMin,
            max: rangeMax
          },
          weighKey: (_) => 1
        }}/>
      </div>
    </div>
  )
}

export default BipolarPage 
