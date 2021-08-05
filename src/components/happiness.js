import React, { useState, useEffect } from 'react'

export default function Happiness(props) {

  const [score, setScore] = useState(-1)
  const {error, data} = props

  // Update the score from the query
  useEffect(() => {
    const queryScore = data?.feeling?.score
    if (!isNaN(queryScore)) {
      setScore(queryScore)
    }
  }, [data])

  if (score < 0 || error) {
    const errorText = error? 'error' : ''
    return (
      <>
        Happiness: {errorText}
      </>
    )
  }
  return (
    <>
      Happiness: {score}%
    </>
  )
}
