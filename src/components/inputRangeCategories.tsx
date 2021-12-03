import React from 'react'
import InputRange from './inputRange'

const InputRangeCategories = (props) => {
  const {hideRange, labelPersona, valueToStyles} = props
  return props.categories.map((category, i) => {
    return (
      <InputRange key={i} {...{
        category, hideRange,
        label: labelPersona(category),
        cls: valueToStyles(category),
        limit: [0, 1]
      }}/> 
    )
  })
}

export default InputRangeCategories
