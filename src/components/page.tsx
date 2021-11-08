import React, { useState } from 'react'
import styles from './page.module.css';

import {
  hastToReact
} from 'hot-cold-guide'
import {
  GuideElement
} from './guide'

const HTML5_TAGS = [
  'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base',
  'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
  'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details',
  'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption',
  'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head',
  'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins',
  'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'map', 'mark', 'menu',
  'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option',
  'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby',
  'samp', 'script', 'section', 'select', 'small', 'source', 'span',
  'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td',
  'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track',
  'ul', 'var', 'video', 'wbr'
]
const InputRange = (props) => {
  const step = 0.05
  const bigStep = 0.2
  const { inputValue } = props
  const { bounds } = props
  const className = styles[props.cls]
  return (
    <div>
			<div>{props.label}</div>
			<div className={[styles.rangeContainer, className].join(' ')}>
				<button className={`${styles.round} ${styles.down}`}
          onClick={() => {
						props.valueSetter(inputValue - bigStep)
          }}>
          -
        </button>
				<input 
					type="range" 
					min={bounds.min + step}
					max={bounds.max}
					value={inputValue} 
					onChange={(event) => {
						const {value} = event.target
						props.valueSetter(value)
					}}
					step={step}/>
				<button className={`${styles.round} ${styles.up}`}
          onClick={() => {
						props.valueSetter(inputValue + bigStep)
          }}>
          +
        </button>
			</div>
    </div>
  )
}

const clamp = ({min, max}, value) => {
  return Math.max(min, Math.min(max, value))
}

const fromGain = (bounds, sign, absValue) => {
  return sign * (bounds.max - absValue);
}
const toGain = (bounds, sign, value) => {
  return bounds.max - (sign * value);
}

const makeRangeSetter = ({sign, bounds, setRange}) => {
  return (absValue) => {
    const clampedValue = clamp(bounds, absValue)
    const value = fromGain(bounds, sign, clampedValue)
    setRange(value)
  }
}

const Page = (props) => {

  const key = 'sentiment'
  const bounds = {
    min: 0,
    max: 1
  }
  const [rangeMin, setRangeMin] = useState(-0.5)
  const [rangeMax, setRangeMax] = useState(0.5)
  // Generate all content from hast
  const content = hastToReact(props.body, {
    components: Object.fromEntries(HTML5_TAGS.map(tag => {
      return [
        tag,
        GuideElement(tag, {
          key, range: {
            min: rangeMin,
            max: rangeMax
          }
        })
      ]
    }))
  })
  const minGain = toGain(bounds, -1, rangeMin)
  const maxGain = toGain(bounds, +1, rangeMax)
  return (
    <div className={styles.mainContainer}>
			<div className={styles.controlContainer}>
				<InputRange cls="optimist"
					label="Optimism" bounds={bounds}
					valueSetter={makeRangeSetter({
            sign: +1, setRange: setRangeMax, bounds
          })}
					inputValue={maxGain}
				/> 
				<InputRange cls="pessimist"
					label="Pessimism" bounds={bounds}
					valueSetter={makeRangeSetter({
            sign: -1, setRange: setRangeMin, bounds
          })}
          inputValue={minGain}
				/> 
			</div>
      <div className={styles.contentContainer}>
        {content}
      </div>
    </div>
  )
}

export default Page 
