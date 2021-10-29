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
  const bounds = {
		min: 0.1,
		max: 1,
  }
	const sign = {
		min: -1,
		max: +1
	}[props.scope]
  return (
    <div>
			<div>{props.label}:</div>
			<div className={[styles.range, styles[props.cls]].join(' ')}>
				<span>-</span>
				<input 
					type="range" 
					min={bounds.min}
					max={bounds.max}
					value={sign * props.range[props.scope]} 
					onChange={(event) => {
						const {value} = event.target
						props.setRangeKey(props.scope, sign * value)
					}}
					step={step}/>
				<span>+</span>
			</div>
    </div>
  )
}

const Page = (props) => {

  const key = 'sentiment'
  const [range, setRange] = useState({
    min: -0.5,
    max: 0.5
  })
  const setRangeKey = (key, value) => {
    setRange({...range, [key]: value})
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
    <>
			<div className={styles.rangeContainer}>
				<InputRange scope="min" cls="hot"
					label="Optimism"
					setRangeKey={setRangeKey}
					range={range}
				/> 
				<InputRange scope="max" cls="cold"
					label="Pessimism"
					setRangeKey={setRangeKey}
					range={range}
				/> 
			</div>
      <div className={styles.content}>
        {content}
      </div>
    </>
  )
}

export default Page 
