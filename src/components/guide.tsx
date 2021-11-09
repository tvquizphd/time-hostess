import React from 'react'
import styles from './guide.module.css';

const extractGuidance = (node, key) => {
  const keyData = node?.data?.textData[key] || {
    mean: 0
  }
  return keyData.mean
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
  const {key, range} = options
  // A component that styles arbitarty tags
  return (props) => {

    const keyData = extractGuidance(props.node, key)
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