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
  getPrevNext,
  vectorSimilarity,
  takeAngleVector,
  radianToAngle,
  angleToRadian,
  angleBetween,
  angleRange,
  angleDifference,
  distributeAngles,
  sortVectorSimilarity
} from '../lib/angleUtil'


import InputRangeCategories from './inputRangeCategories'
import InputCompass from './inputCompass'
import FlavorText from './flavorText'
import BookPages from './bookPages'
import Content from './content'

const MAX = 'max'
const STEPS = {
  small: 0.05,
  big: 0.25
}
const RANGE = {
  min: 0,
  max: 1
}
const COLORS = [
  'none', 'warm', 'warmer', 'warmest'
]

const darkenColor = (color, n) => {
  const max = COLORS.length - 1
  const c = COLORS.indexOf(color)
  return COLORS[Math.min(max, c + n)]
}

const weigher = ({categories}) => {
  return ({value}) => {
    const cats = categories.filter(({keys}) => {
      return keys.map(k => k.value).includes(value)
    })
    return takeWeightedMean(cats, 'value', 1).mean
  }
}

const findGuideValues = (options) => {
  const {node, weighKey, categories, metric} = options
  return categories.map((category) => {
    const {keys} = category
    const value = extractGuidance({
      node, keys, weighKey, metric
    })
    return {...category, value}
  })
}

const sumGuideValues = (guideValues) => {
  return guideValues.map(({vector, value}) => {
    return [
      value * vector[0],
      value * vector[1]
    ]
  }).reduce((p1, p2) => {
    return [
      p1[0] + p2[0],
      p1[1] + p2[1]
    ]
  }, [0, 0])
}

const findGuideVector = (guideValues) => {
  const [x, y] = sumGuideValues(guideValues)
  const angle = radianToAngle(Math.atan2(y, x))
  const magnitude = Math.sqrt(x * x + y * y)
  return {
    angle,
    magnitude,
    vector: [x, y]
  }
}

const matchCategory = ({categories, vector, range}) => {
  const cat = sortVectorSimilarity(categories, vector)[0]
  const similarity = vectorSimilarity(cat.vector, vector, range)
  return {
    similarity,
    category: cat
  }
}

const prefixColor = (color, cls) => {
  const prefix = color !== 'none'? `${cls}-` : ''
  return prefix + color
}

const findColors = (color, cls) => {
  const darkColor = darkenColor(color, 2);
  return {
    fill: styles[prefixColor(color, cls)],
    outline: styles[prefixColor(darkColor, cls)]
  }
}

const matchStyle = ({similarity, category, range}) => {
  const {cls, value} = category
  // Color by cosine similarity, at most category value
  const color = selectFromList({
    range,
    items: COLORS,
    value: Math.min(similarity, value) 
  })
  return findColors(color, cls)
}

const valueToStyle = (options) => {
  const {range, categories} = options
  // Add all values for all categories
  const {vector} = findGuideVector(
    findGuideValues(options)
  )
  // Find closest category to vector
  const {category, similarity} = matchCategory({
    categories, vector, range
  })
  // Return color for category
  return matchStyle({
    similarity, category, range
  }).fill
}

const styler = ({range, metric, categories}) => {
  return ({node, keys}) => {
    return valueToStyle({
      weighKey: weigher({categories}),
      categories, metric, range,
      node, keys
    })
  }
}

const clickGuideButton = (options) => {
  findGuideValues(options).forEach((category) => {
    category.setter(category.value)
  })
}

const clicker = ({metric, categories}) => {
  return ({node, keys}) => {
    clickGuideButton({
      metric, categories,
      weighKey: _ => 1,
      node, keys
    })
  }
}

const labelPersona = ({keys}) => {
  return keys.map(({value}) => {
    return {
      'kenm': 'Ken M',
      'laozi': 'Laozi',
      'buddha': 'Buddha',
      'confucius': 'Confucius'
    }[value] || value
  }).join(' & ')
}

const useObjectState = (initial) => {
  const [value, setter] = useState(initial)
  return {setter, value}
}

const useCategory = (keyGroup) => {
  const {angle, vector} = keyGroup
  return {
    ...keyGroup,
    ...useObjectState(0)
  }
}

const useCategories = ({keyGroups, range, steps}) => {
  return keyGroups.map(useCategory).map((category) => {
    const canClear = canClearValue({range, steps, category})
    return {
      ...category,
      canClear
    }
  })
}

const filterSolo = (categories) => {
  return categories.filter(({keys}) => {
    return keys.length == 1
  })
}

const makeGroupClass = (keys, i) => {
  return keys.length == 1 ? `${keys[0].domain}-${i}` : 'other'
}

const getNextNested = (lists) => {
  const indices = [].concat(...lists.map(({keys}, i) => {
    return keys.map((_, j) => {
      return {i, j}
    })
  }))
  return (o1) => {
    const k = indices.findIndex((o2) => {
      return o1.i === o2.i && o1.j === o2.j
    })
    if (k < 0) {
      return {
        next_key: null
      }
    } 
    const {next} = getPrevNext(indices, k)
    const {keys} = lists[next.i]
    return {
      next_key: keys[next.j]
    }
  }
}

const makeKeyGroups = (_lists) => {
  const lists = _lists.map((options) => {
    const {keys, min, max, pad} = options
    const diff = angleDifference(max, min) / keys.length
    const angles = distributeAngles(keys.length, min, max)
    return {
      ...options,
      keys: keys.map((key, k) => {
        const angle = angles[k]
        const vector = takeAngleVector(angle)
        const wedge = angleRange({
          diff: diff - pad, mean: angle
        })
        return {...key, angle, vector, wedge}
      })
    }
  })
  const getNext = getNextNested(lists)
  return [].concat(...lists.map((options, i) => {
    const {keys, min, max} = options
    // Make all key groups for given list of keys
    return [].concat(...keys.map((key, j) => {
      const { next_key } = getNext({i, j})
      const keys2 = [key, next_key || key]
      const keys1 = [key]

      const keysWedge = {
        min: keys2[0].wedge.max,
        max: keys2[1].wedge.min
      }
      const keysAngle = angleBetween(keysWedge).mean

      return [
        {
          keys: keys1, wedge: key.wedge,
          angle: key.angle, vector: key.vector,
          cls: makeGroupClass(keys1, j)
        },
        {
          wedge: keysWedge,
          keys: keys2, angle: keysAngle,
          vector: takeAngleVector(keysAngle),
          cls: makeGroupClass(keys2, j)
        }
      ]
    }))
  }))
}

const canClearValue = ({range, steps, category}) => {
  const {value} = category
  return range.max <= value + steps.small
}

const getWedgeStyle = ({allEmpty, isEmpty, category}) => {
  const {cls, value} = category
  const isOther = cls === 'other'
  const warmFill = findColors('warm', cls).fill
  const fill = (isEmpty && !allEmpty) ? styles.none : warmFill
  const colorClass = isOther ? styles.hide : fill
  return {
    hasX: [styles[cls]],
    wedge: [styles.wedge, colorClass] 
  }
}

const setupCompass = (options) => {
  const { soloCategories, allCategories } = options
  const { range, steps } = options
  const { angle, vector } = findGuideVector(soloCategories)
  // Find highest valued category
  const {category, similarity} = matchCategory({
    categories: soloCategories, vector, range
  })
  // Find color for category
  const allEmpty = similarity < range.min + steps.small
  const compassClass = findColors('none', '')
  const needleClass = allEmpty ? {
    fill: styles.emptyNeedle,
    outline: styles.hide
  } : matchStyle({
    similarity, category, range
  })

  // Define wedges by category
  const wedges = soloCategories.map((category, i) => {
    const {value} = category
    const isEmpty = value < range.min + steps.small
    return {
      range,
      steps,
      category,
      wedgeClass: getWedgeStyle({allEmpty, isEmpty, category})
    }
  })
  return {
    compassClass,
    needleClass,
    wedges,
    angle,
    range,
    steps
  }
}

const valueToBookStyles = ({range}) => {
  return (category) => {
    const {cls, value} = category
    return {
      ...matchStyle({
        similarity:1, category, range
      }),
      label: styles[cls]
    }
  }
}

const valueToRangeStyles = ({range}) => {
  return (category) => {
    const {cls, value} = category
    const colorClass = matchStyle({
      similarity:1, category, range
    }).fill
    return {
      label: [styles[cls]],
      root: [styles[cls]],
      plus: [colorClass]
    }
  }
}

const makeTwoGroups = (options) => {
  const {k1, k2, ratio, padRatio, range} = options
  const dFull = ratio * 360
  const dHalf = dFull * 0.5
  const pad = padRatio * dFull
  return makeKeyGroups([{
    keys: k1, min: -dHalf, max: dHalf, pad
  },{
    keys: k2, min: dHalf, max: 360 - dHalf, pad
  }])
}

const MultiplePersonalityPage = (props) => {

  const k1 = props.keys.filter(({domain}) => {
    return domain === 'comedy'
  })
  const k2 = props.keys.filter(({domain}) => {
    return domain === 'advice'
  })
  const steps = STEPS
  const range = RANGE
  const metric = MAX
  const keyGroups = makeTwoGroups({
    k1, k2, ratio: 3/8, padRatio: 1/8
  })
  const allCategories = useCategories({keyGroups, steps, range})
  const soloCategories = filterSolo(allCategories)

  const compassProps = setupCompass({
    soloCategories,
    allCategories,
    steps,
    range
  })
  const rangeProps = {
    valueToStyles: valueToRangeStyles({range}),
    labelPersona, hideRange: true,
    categories: soloCategories
  }
  const contentProps = {
    ...props,
    valueToStyle: styler({
      categories: soloCategories,
      range, metric
    }),
    clickGuideButton: clicker({
      categories: allCategories, metric
    })
  }

  const pageProps = {
    valueToStyles: valueToBookStyles({range}),
    pageClass: [styles.bookPage],
    findGuideVector,
    matchCategory,
    labelPersona,
    range,
    steps
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.uiContainer}>
        <div className={styles.bookContainer}>
          <BookPages {...pageProps}> 
            <FlavorText {...{
              ...pageProps, allCategories, soloCategories
            }}/>
          </BookPages>
        </div>
        <InputCompass {...compassProps}/>
        <InputRangeCategories {...rangeProps}/>
      </div>
      <div className={styles.contentContainer}>
        <Content {...contentProps}/>
      </div>
    </div>
  )
}

export default MultiplePersonalityPage 
