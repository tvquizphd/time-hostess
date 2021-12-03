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

const COLORS = [
  'coolest', 'cooler', 'cool',
  'none',
  'warm', 'warmer', 'warmest'
]

const valueToStyle = (options) => {
  const {metric, range, node, keys} = options
  const value = extractGuidance({
    node, keys, metric,
    weighKey: (_) => 1
  })
  const color = selectFromList({
    value, range, items: COLORS
  })
  return styles[color]
}

const styler = ({range, metric}) => {
  return ({node, keys}) => {
    return valueToStyle({
      metric, range, node, keys
    })
  }
}

const BipolarPage = (props) => {

  const [rangeMin, setRangeMin] = useState(-0.5)
  const [rangeMax, setRangeMax] = useState(0.5)

  const coolInputClass = {
    root: [styles['cooler-range']],
    label: [styles['cool-range']],
    plus: [styles.coolest]
  }
  const warmInputClass = {
    root: [styles['warmer-range']],
    label: [styles['warm-range']],
    plus: [styles.warmest]
  }

  return (
    <div className={styles.mainContainer}>
			<div className={styles.controlContainer}>
				<InputRange {...{
          category: {
            setter: setRangeMax,
            value: rangeMax,
            canClear: false,
            keys: [null]
          }, limit: [+1, 0],
          label: "Optimism", cls: warmInputClass
        }}/> 
				<InputRange {...{
          category: {
            setter: setRangeMin,
            value: rangeMin,
            canClear: false,
            keys: [null]
          }, limit: [-1, 0],
          label: "Pessimism", cls: coolInputClass
        }}/> 
			</div>
      <div className={styles.contentContainer}>
        <Content {...{
          ...props,
          valueToStyle: styler({
            metric: 'mean',
            range: {
              min: rangeMin,
              max: rangeMax
            }
          }),
          guideAll: true
        }}/>
      </div>
    </div>
  )
}

export default BipolarPage 
