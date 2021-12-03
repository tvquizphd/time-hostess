import React from 'react'
import styles from './guide.module.css'

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

const isGuideButton = (node) => {
  const {className} = node.properties
  return (className || []).includes('guide-button')
}

const isGuideNone = (node) => {
  const {className} = node.properties
  return !(className || []).includes('guide')
}

const onClick = (options) => {
  const {node, clickGuideButton} = options
  const canClick = isGuideButton(node) && clickGuideButton
  if (canClick) {
    return (e) => {
      clickGuideButton(options)
    }
  }
  return null
}

const styleGuide = (options) => {
  const {valueToStyle, guideAll, node} = options
  const hasGuideStyle = guideAll || !isGuideNone(node)
  return hasGuideStyle ? valueToStyle(options) : ''
}

const GuideElement = (TagName, options) => {
  // A component that styles arbitarty tags
  return (props) => {
    const {node} = props
    const divStyle = [
      styleGuide({...options, node}),
      ...tagToClasses(TagName).map(str => styles[str])
    ].join(' ')

    return (
      <TagName 
        {...noNode(props)}
        className={divStyle}
        onClick={onClick({...options, node})}
      >
        {props.children}
      </TagName>
    )
  }
}

export {
  GuideElement
}
