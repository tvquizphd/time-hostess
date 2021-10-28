import React, { useState } from 'react'
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

const Page = (props) => {

  const content = hastToReact(props.body, {
    components: Object.fromEntries(HTML5_TAGS.map(tag => {
      return [tag, GuideElement(tag)]
    }))
  })
  return (
    <div>
      {content}
    </div>
  )
}

export default Page 
