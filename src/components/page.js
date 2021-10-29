import React, { useState } from 'react'
import styles from './page.module.css';

import {
  hastToReact
} from 'hot-cold-guide/lib/toReact'
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
  const { maxBounds } = props
	const sign = {
		min: -1,
		max: +1
	}[props.scope]
  const absValue = sign * props.range[props.scope]
  const className = styles[props.cls]
  return (
    <div>
			<div>{props.label}</div>
			<div className={[styles.rangeContainer, className].join(' ')}>
				<button className={`${styles.round} ${styles.down}`}
          onClick={() => {
						props.setRangeKey(props.scope, sign * (absValue - bigStep))
          }}>
          -
        </button>
				<input 
					type="range" 
					min={maxBounds.min + step}
					max={maxBounds.max}
					value={absValue} 
					onChange={(event) => {
						const {value} = event.target
            const signedValue = sign * value
						props.setRangeKey(props.scope, signedValue)
					}}
					step={step}/>
				<button className={`${styles.round} ${styles.up}`}
          onClick={() => {
						props.setRangeKey(props.scope, sign * (absValue + bigStep))
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

const Page = (props) => {

  const key = 'sentiment'
  const maxBounds = {
    min: 0,
    max: 1
  }
  const [range, setRange] = useState({
    min: -0.5,
    max: 0.5
  })
  const setRangeKey = (key, value) => {
    const sign = value >= 0 ? +1 : -1
    if (sign * range[key] < 0) {
      return
    }
    const clamped = clamp(maxBounds, sign * value)
    setRange({...range, [key]: sign * clamped})
  }
  // Generate all content from hast
  const content = hastToReact(props.body, {
    components: Object.fromEntries(HTML5_TAGS.map(tag => {
      return [
        tag,
        GuideElement(tag, {
          key, range
        })
      ]
    }))
  })
  return (
    <div className={styles.mainContainer}>
			<div className={styles.controlContainer}>
				<InputRange scope="min" cls="optimist"
					label="Optimism" maxBounds={maxBounds}
					setRangeKey={setRangeKey}
					range={range}
				/> 
				<InputRange scope="max" cls="pessimist"
					label="Pessimism" maxBounds={maxBounds}
					setRangeKey={setRangeKey}
					range={range}
				/> 
			</div>
      <div className={styles.contentContainer}>
        {content}
      </div>
    </div>
  )
}

export default Page 
