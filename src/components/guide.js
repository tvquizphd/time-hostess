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
  const offset = value - range.min
  const fraction = offset / (range.max - range.min)
  const colorIndex = Math.floor(fraction * colors.length)
  return colors[Math.max(0,Math.min(colors.length, colorIndex))]
}

const getConfig = () => {
  const key = 'sentiment'
  const range = {
    min: -3,
    max: 3
  }
  return {key, range}
}

const noNode = (props) => {
  const {node, ...otherProps} = props;
  return otherProps;
}

export const GuideElement = (TagName) => {
  // A component that styles arbitarty tags
  return (props) => {

    const {key, range} = getConfig()
    const keyData = extractGuidance(props.node, key)
    const divStyle = styles[valueToColor(range, keyData)]

    return (
      <TagName className={divStyle} {...noNode(props)}>
        {props.children}
      </TagName>
    )
  }
}
