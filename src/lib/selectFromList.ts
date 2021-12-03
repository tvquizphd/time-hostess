const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value))
}

const selectFromList = ({value, range, items}) => {
  const maxIndex = items.length - 1
  const fraction = (value - range.min) / (range.max - range.min)
  const index = Math.floor(fraction * maxIndex)
  return items[clamp(index, 0, maxIndex)]
}

export {
  selectFromList
}
