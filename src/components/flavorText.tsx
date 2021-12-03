import React from 'react'
import {
  clicker 
} from '../lib/clicker'

const listNames = (({options, categories, steps, ands}) => {
  const {comma, and} = ands
  const {range} = options
  const {valueToStyles, labelPersona} = options
  const ultimate = Math.max(0, categories.length - 1)
  const penultimate = ultimate - 1

  const lists = categories.map((category, i) => {
    const toggleClick = clicker({category, range, steps})
    const cls = valueToStyles(category).label
    const label = labelPersona(category)
    return [
      (<button onClick={toggleClick}
        key={i} className={cls}>{label}</button>),
      ...(ultimate === i ? [] : [
        penultimate === i ? [and] : [comma]
      ])
    ]
  })
  return [' '].concat(...lists)
})

const getCategory = ({options, categories}) => {
  const { range } = options
  const { matchCategory, findGuideVector } = options
  const { angle, vector } = findGuideVector(categories)
  const { category, similarity } = matchCategory({
    categories, vector, range
  })
  return {
    category, similarity, angle, vector
  }
}

const acceptWelcome = ({options}) => {
  // Find color for category
  const {range, steps} = options
  const {soloCategories} = options
  const {similarity} = getCategory({options, categories: soloCategories})
  const allEmpty = similarity < range.min + steps.small
  return !!allEmpty
}

const welcomeMessage  = ({options, steps, ands}) => {
  const {soloCategories} = options
  const nameList = listNames({
    options, categories: soloCategories, steps, ands
  })
  return [{
    accept: acceptWelcome,
    content: (
      <div key='welcome'>
        <p>
        Welcome! Select a &quot;mentor&quot; on the right,
        or <em>just click a quote on the page</em>!
        Find similar quotes to {nameList}.
        </p>
      </div>
    )
  }]
}

const canClearCategories = ({categories, options}) => {
  // Find color for category
  const {range, steps} = options
  return categories.filter(({value}) => {
    return range.max <= value + steps.small
  })
}

const describeNameList = (opt) => {
  const {categories, options, steps, ands} = opt
  const nameList = listNames({
    categories, options, steps, ands
  })
  const plural = categories.length > 1
  const is = plural ? 'are' : 'is'
  const s =  plural ? 's' : ''
  if (!categories.length) {
    return ''
  }
  return (
    <>
    Your currently chosen guide{s} {is} {nameList}.
    </>
  )
}

const focusOneMessage  = ({options, steps, ands}) => {
  const {soloCategories} = options
  const {similarity, category} = getCategory({
    options, categories: soloCategories
  })
  const categories = soloCategories.filter(({value}) => {
    return value >= category.value
  })
  const clearCategories = canClearCategories({categories, options})

  const closeX = '×'
  return [{
    accept: ((_) => {
      return clearCategories.length
    }),
    content: (
      <div key='focusOne'>
        <p>
        {
          describeNameList({
            categories: clearCategories,
            options, steps, ands
          })
        }
        {" "}Click any &quot;{closeX}&quot; to dismiss them.
        </p>
      </div>
    )
  }]
}

const makeFlavorText = (options) => {
  const ands = {
    and: ', or ',
    comma: ', '
  }
  // Increas step size
  const {range} = options
  const rangeDiff = range.max - range.min
  const steps = {
    ...options.steps,
    big: 0.5 * rangeDiff
  }

  return (
    <>
      {[
        ...welcomeMessage({options, steps, ands}),
        ...focusOneMessage({options, steps, ands})
      ].filter(({accept}) => {
        return accept({options})
      }).map(({content}) => {
        return content
      })
      }
    </>
  )
}

export default makeFlavorText
