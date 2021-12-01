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
  const {className} = node?.properties
  return className?.includes('guide-button')
}

const isGuideNone = (node) => {
  const {className} = node?.properties
  return className?.includes('guide-ignore')
}

const onClick = (node, clickGuideButton) => {
  const canClick = isGuideButton(node) && clickGuideButton
  if (canClick) {
    return (e) => {
      clickGuideButton(node)
    }
  }
  return null
}


const styleGuide = (options) => {
  const {valueToStyle, node} = options
  return isGuideNone(node) ? '' : valueToStyle(options)
}

const GuideElement = (TagName, options) => {
  const {clickGuideButton} = options
  // A component that styles arbitarty tags
  return (props) => {
    const {node} = props
    const divStyle = [
      styleGuide({...options, node}),
      ...tagToClasses(TagName).map(str => styles[str])
    ].join(' ')

    return (
      <TagName 
        onClick={onClick(node, clickGuideButton)}
        className={divStyle}
        {...noNode(props)}
      >
        {props.children}
      </TagName>
    )
  }
}

export {
  GuideElement
}
