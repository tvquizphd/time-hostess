import React, { useState } from 'react'
import styles from './bipolarPage.module.css'
import {
  toDomain,
  makeRangeSetter
} from '../lib/rangeSetter'
import InputRange from './inputRange'
import Content from './content'

const BipolarPage = (props) => {

  const [rangeMin, setRangeMin] = useState(-0.5)
  const [rangeMax, setRangeMax] = useState(0.5)

  return (
    <div className={styles.mainContainer}>
			<div className={styles.controlContainer}>
				<InputRange {...{
          cls: ['optimist', 'optimistButton'].map(k=>styles[k]),
          setter: setRangeMax, value: rangeMax, limit: +1,
          label: "Optimism"
        }}/> 
				<InputRange {...{
          cls: ['pessimist', 'pessimistButton'].map(k=>styles[k]),
          setter: setRangeMin, value: rangeMin, limit: -1,
          label: "Pessimism"
        }}/> 
			</div>
      <div className={styles.contentContainer}>
        <Content {...{
          ...props,
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
