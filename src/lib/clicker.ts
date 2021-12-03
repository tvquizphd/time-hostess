const clicker = ({category, range, steps}) => {

  const {value, canClear, setter, keys} = category

  const clearClick = () => {
    setter(range.min)
  }
  const plusClick = () => {
    setter(value + steps.big)
  }

  const canClick = keys.length === 1
  return canClick ? () => {
    canClear ? clearClick() : plusClick()
  } : null
}

export {
  clicker
}
