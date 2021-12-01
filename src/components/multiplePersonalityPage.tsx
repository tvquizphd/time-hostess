import React, { useState } from 'react'
import {takeWeightedMean} from 'hot-cold-guide'

import styles from './multiplePersonalityPage.module.scss'
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
import {
  angleSimilarity,
  radianToAngle,
  angleToRadian,
  distributeAngles,
  sortAngleDifference
} from '../lib/angleUtil'

import InputRange from './inputRange'
import Content from './content'

const extractVectorGuidance = (options) => {
  const {node, weighKey, metric} = options
  return options.categories.map(({keys, angle}) => {
    const value = extractGuidance({
      node, keys, weighKey, metric
    })
    const rad = angleToRadian(angle)
    return [
      value * Math.cos(rad),
      value * Math.sin(rad)
    ]
  }).reduce((p1, p2) => {
    return [
      p1[0] + p2[0],
      p1[1] + p2[1]
    ]
  }, [0, 0])
}
const valueToStyle = (options) => {
  const {range, categories} = options
  // Add all values for all categories
  const [x, y] = extractVectorGuidance(options)
  const magnitude = Math.sqrt(x * x + y * y)
  const angle = radianToAngle(Math.atan2(y, x))
  const cat = sortAngleDifference(categories, angle)[0]
  const similarity = angleSimilarity(cat.angle, angle, range)
  // Color by cosine similarity, at most category value
  const color = selectFromList(
    Math.min(similarity, cat.value), range, [
    'none', 'warm', 'warmer', 'warmest'
  ])
  if (color === 'none') {
    return styles.none
  }
  // Return color for category
  return styles[`${cat.cls}-${color}`]
}

const labelPersona = (key) => {
  return {
    'kenm': 'Ken M',
    'laozi': 'Laozi',
    'buddha': 'Buddha',
    'confucius': 'Confucius'
  }[key] || key
}

const useObjectState = (initial) => {
  const [value, setter] = useState(initial)
  return {setter, value}
}

const useCategory = (key, i) => {
  return {
    keys: [key],
    angle: key.angle,
    ...useObjectState(0.5),
    cls: `${key.domain}-${i}`,
    key: key.value
  }
}

const useCategories = (allKeys) => {
  return allKeys.map(useCategory)
}

const addAngles = (keys, min, max) => {
  const angles = distributeAngles(keys.length, min, max)
  return keys.map((k,i) => {
    const angle = angles[i]
    return {...k, angle}
  })
}

const MultiplePersonalityPage = (props) => {

  const comedyKeys = props.keys.filter(({domain}) => {
    return domain === 'comedy'
  })
  const adviceKeys = props.keys.filter(({domain}) => {
    return domain === 'advice'
  })
  const allKeys = [].concat(...[
    addAngles(comedyKeys, 0, 180),
    addAngles(adviceKeys, 180, 360)
  ])
  const categories = useCategories(allKeys)

  const clickGuideButton = (node) => {
    // Only handle quotes
    categories.forEach(({keys, setter}) => {
      const value = extractGuidance({
        node, keys, weighKey: _ => 1,
        metric: 'max'
      })
      setter(value)
      return [keys[0].value, value]
    })
  }

  const weighKey = ({value}) => {
    const cats = categories.filter(({keys}) => {
      return keys.map(k => k.value).includes(value)
    })
    return takeWeightedMean(cats, 'value', 1).mean
  }

  return (
    <div className={styles.mainContainer}>
			<div className={styles.controlContainer}>
        {categories.map(({setter, value, key, cls}) => {
          return (
            <InputRange key={cls} {...{
              label: labelPersona(key),
              cls: [`${cls}`, `${cls}-warmest`].map(k=>styles[k]),
              setter, value, limit: [0, 1]
            }}/> 
          )
        })}
			</div>
      <div className={styles.contentContainer}>
        <Content {...{
          ...props,
          range: {
            min: 0,
            max: 1
          },
          categories,
          valueToStyle,
          clickGuideButton,
          weighKey
        }}/>
      </div>
    </div>
  )
}

export default MultiplePersonalityPage 
