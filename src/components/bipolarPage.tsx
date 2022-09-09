import React, { useState } from 'react'
import styles from './bipolarPage.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeftRight, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { Navigrid } from './templates/navigrid'
import { Ingrid } from './templates/ingrid'
import {
  toRange,
} from '../lib/rangeSetter'
import {
  extractGuidance
} from '../lib/extractor'
import {
  selectFromList
} from '../lib/selectFromList'

import InputRange from './inputRange'
import Content from './content'

import type { Point } from '../lib/rangeSetter'

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

  const coolInputClass = {
    root: [styles['darkUI-range']],
    plus: [styles.cooler]
  }
  const noneInputClass = {
    root: [styles['darkUI-range']],
    plus: [styles.noneUI]
  }
  const warmInputClass = {
    root: [styles['darkUI-range']],
    plus: [styles.warmer]
  }

  const gridProps = {
    n: '3',
    w: '1fr'
  }

  const maxContrast = 0.8;
  const [contrast, setContrast] = useState(0.2);
  const [pushed, push] = React.useState(1);
  const toMean = (p) => [0.5, 0, -0.5][p];
  const lowRange: Point = [-1, toMean(pushed)];
  const highRange: Point = [1, toMean(pushed)];
  const items = [
    ["Negative Filter", styles.coolUI],
    ["No Filter", styles.noneUI],
    ["Positive Filter", styles.warmUI],
  ];
  const navContainer = [
    styles.iceUIContainer,
    styles.darkUIContainer,
    styles.fireUIContainer
  ][pushed];
  const inputClass = [
    coolInputClass,
    noneInputClass,
    warmInputClass
  ][pushed];
  const rangeMin = toRange(lowRange, contrast);
  const rangeMax = toRange(highRange, contrast);

  return (
    <div className={styles.mainContainer}>
			<p>
        <h3> Sentiment Analysis </h3>
				The below song lyrics show negative vibes in purple,
				with positive vibes shown in orange. A pessimist may
				add a depressed bias with the &quot;Negative Filter&quot;.
				An optimist may add an uplifting bias with the
				&quot;Positive Filter&quot;.
			</p>
				<Navigrid {...gridProps}>
					<Ingrid {...{items, pushed, push}}/>
				</Navigrid>	
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
      <div className={navContainer}>
				<InputRange {...{
					limit: [0, maxContrast],
					cls: inputClass,
					category: {
						setter: setContrast,
						value: contrast,
						canClear: false,
						keys: [null]
					}
				}}/> 
			</div>
			<p>
				Whether using either filter (or no filter), 
				you can control the certainty of the classifier.
				Just slide the controller handle
				(<FontAwesomeIcon icon={faLeftRight} />) from 
        left (<FontAwesomeIcon icon={faEyeSlash} />)
        to right (<FontAwesomeIcon icon={faEye} />).
			</p>
			<div className={styles.footer}>
				<a href="https://tvquizphd.com">TVQuizPhD.com</a>
			</div>
    </div>
  )
}

export default BipolarPage 
