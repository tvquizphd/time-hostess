import React from 'react'
import styles from './guide.module.css'
import {takeWeightedMean} from 'hot-cold-guide'

const extractGuidance = ({node, metric, weighKey, keys}) => {
  const resultList = keys.map((key) => {
    return {
      [metric]: 0,
      __w: weighKey(key),
      ...node?.data?.textData[key.value]
    }
  })
  return takeWeightedMean(resultList, metric, '__w').mean
}

const valueToColor = (range, value) => {
  const colors = [
    'coolest', 'cooler', 'cool',
    'none',
    'warm', 'warmer', 'warmest'
  ]
  const maxColorIndex = colors.length - 1;
  const fraction = (value - range.min) / (range.max - range.min)
  const colorIndex = Math.floor(fraction * maxColorIndex)
  return colors[Math.max(0,Math.min(maxColorIndex, colorIndex))]
}

const tagToClasses = (TagName) => {
  if (TagName.length == 2 && TagName[0] == 'h') {
    return ['topic']
  }
  return []
}

const noNode = (props) => {
  const {node, ...otherProps} = props;
  return otherProps;
}

const GuideElement = (TagName, options) => {
  const {range} = options
  // A component that styles arbitarty tags
  return (props) => {
    const {node} = props
    const keyData = extractGuidance({...options, node})
    const divStyle = [
      styles[valueToColor(range, keyData)],
      ...tagToClasses(TagName).map(str => styles[str])
    ].join(' ')

    return (
      <TagName className={divStyle} {...noNode(props)}>
        {props.children}
      </TagName>
    )
  }
}

export {
  GuideElement
}
