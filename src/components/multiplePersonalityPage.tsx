import React, { useState } from 'react'
import styles from './multiplePersonalityPage.module.css'
import {
  toDomain,
  makeRangeSetter
} from '../lib/rangeSetter'
import InputRange from './inputRange'
import Content from './content'

const stringifyPersonas = (personas) => {
  return personas.map(({label}) => {
    return label
  }).join('/ ')
}

const MultiplePersonalityPage = (props) => {

  const [range0, setRange0] = useState(0.5)

  const weighKey = ({domain}) => {
    return {
      comedy: 1 - range0,
      advice: range0
    }[domain] || 0
  }
  return (
    <div className={styles.mainContainer}>
			<div className={styles.controlContainer}>
				<InputRange {...{
          cls: ['comedy', 'comedyButton'].map(k=>styles[k]),
          setter: setRange0, value: range0, limit: +1,
          label: "Ken M"
        }}/> 
			</div>
      <div className={styles.contentContainer}>
        <Content {...{
          ...props,
          range: {
            min: -1,
            max: 1
          },
          weighKey
        }}/>
      </div>
    </div>
  )
}

export default MultiplePersonalityPage 
